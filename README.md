# Job Ad Skill Extraction & Mapping

Extract skills from job advertisements and map them to the ESCO taxonomy.

## Overview

This project extracts skills from job ads and maps them to the ESCO (European Skills, Competences, Qualifications and Occupations) taxonomy using a hybrid embedding approach (fuzzy matching + semantic similarity).

## Pipeline

1. **EDA** - Explore job ads and ESCO taxonomy
2. **Sample Selection** - Select samples for evaluation
3. **ESCO Mapping** - Extract skills and map to ESCO
4. **Evaluation** - Evaluate mapping performance

## Results

- Precision@3: ~53% (95% CI: 47.8% - 58.2%)
- Evaluation on 83 valid items with ESCO ground truth
