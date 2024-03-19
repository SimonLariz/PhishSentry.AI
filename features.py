import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

# Load the CSV file
df = pd.read_csv('emails.csv')

# Combine the columns into a single column containing the email text
df['email_text'] = df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

# Use TF-IDF vectorizer to extract features from the emails
vectorizer = TfidfVectorizer(max_features=1000)  # Adjust max_features as needed
features = vectorizer.fit_transform(df['email_text'])

# Convert features to a DataFrame
features_df = pd.DataFrame(features.toarray(), columns=vectorizer.get_feature_names_out())

# Keep only the 1000 most relevant TF-IDF features for each email
top_features_df = features_df[features_df.columns[:1000]]

# Save the result to a new CSV file
top_features_df.to_csv('top_features.csv', index=False)