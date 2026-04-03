from typing import List

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


class Skill(BaseModel):
    id: int
    name: str
    category: str


# Fallback mock data
MOCK_SKILLS: List[Skill] = [
    Skill(id=1, name="Python", category="programming"),
    Skill(id=2, name="Data analysis", category="analytics"),
    Skill(id=3, name="Machine learning", category="ml"),
]


def load_skills_from_csv(path: str) -> List[Skill]:
    try:
        df = pd.read_csv(path)
    except Exception as e:
        print(f"Could not load {path}: {e}")
        return MOCK_SKILLS

    required_cols = {"id", "name", "category"}
    if not required_cols.issubset(df.columns):
        print(f"{path} is missing required columns {required_cols}")
        return MOCK_SKILLS

    skills: List[Skill] = []
    for _, row in df.iterrows():
        try:
            skills.append(
                Skill(
                    id=int(row["id"]),
                    name=str(row["name"]),
                    category=str(row["category"]),
                )
            )
        except Exception as e:
            print(f"Skipping row due to error: {e}")
    return skills or MOCK_SKILLS

def html_to_preview(html: str, max_len: int = 240) -> str:
    # Strip HTML tags to plain text
    text = BeautifulSoup(html, "html.parser").get_text(separator=" ", strip=True)
    # Collapse whitespace
    text = " ".join(text.split())
    if len(text) <= max_len:
        return text
    return text[: max_len - 3] + "..."

@app.get("/skills", response_model=List[Skill])
def list_skills() -> List[Skill]:
    # Later we can point this to a real pipeline output file
    return load_skills_from_csv("skills_example.csv")

import json

@app.get("/ads")
def list_ads(limit: int = 20):
    try:
        df = pd.read_csv("sampled_100_ads.csv")
    except Exception as e:
        return {"ok": False, "error": f"Could not read sampled_100_ads.csv: {e}"}

    rows = df.head(limit).to_dict(orient="records")

    # Parse metadata JSON string into an object for easier frontend use
    for r in rows:
        m = r.get("metadata")
        if isinstance(m, str):
            try:
                r["metadata"] = json.loads(m)
            except Exception:
                # keep original string if parsing fails
                pass
        content = r.get("content")
        if isinstance(content, str):
            r["content_preview"] = html_to_preview(content)
    return {"ok": True, "items": rows, "count": len(rows)}

@app.get("/ads/{ad_id}")
def get_ad(ad_id: int):
    try:
        df = pd.read_csv("sampled_100_ads.csv")
    except Exception as e:
        return {"ok": False, "error": f"Could not read sampled_100_ads.csv: {e}"}

    if "id" not in df.columns:
        return {"ok": False, "error": "CSV has no id column"}

    row = df.loc[df["id"] == ad_id]
    if row.empty:
        return {"ok": False, "error": f"No ad with id {ad_id}"}

    item = row.iloc[0].to_dict()

    m = item.get("metadata")
    if isinstance(m, str):
        try:
            item["metadata"] = json.loads(m)
        except Exception:
            pass
    content = item.get("content")
    if isinstance(content, str):
        item["content_preview"] = html_to_preview(content)
    return {"ok": True, "item": item}