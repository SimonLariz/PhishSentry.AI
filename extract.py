import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

# Load CSV file
df = pd.read_csv("emails.csv")

# Create a corpus from all the columns
corpus = []
for column in df.columns:
    corpus.extend(df[column].astype(str))

# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

# Convert TF-IDF matrix to DataFrame and merge it with the original DataFrame
tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=tfidf_vectorizer.get_feature_names_out())

# Merge the TF-IDF DataFrame with the original DataFrame
result = pd.concat([df, tfidf_df], axis=1)

# Display the resulting DataFrame
print(result)