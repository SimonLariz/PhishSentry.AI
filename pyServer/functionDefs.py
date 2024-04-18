import csv
import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


def preprocess(text):
    stop_words = set(stopwords.words("english"))

    # tokenize the text
    tokens = word_tokenize(text)

    # remove punctuation and lowercase
    tokens = [word.lower() for word in tokens if word.isalnum()]

    # remove stop words
    tokens = [word for word in tokens if word not in stop_words]

    preprocessed_text = " ".join(tokens)

    return preprocessed_text


def vectorize(preprocessed_email):

    with open("column_labels.txt", "r") as f:
        column_labels = f.readlines()

    column_labels = [label.strip() for label in column_labels]

    tokens = preprocessed_email.lower().split()

    token_count_dict = {token: tokens.count(token) for token in column_labels}

    feature_vector = list(token_count_dict.values())

    # print("FEATURE VECTOR:\n", feature_vector)

    # print(len(feature_vector))

    with open("my_file.csv", "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(column_labels)
        writer.writerow(feature_vector)

    feature_vector = pd.read_csv("my_file.csv")

    # print("FUNC_DEFS - feature_vector:\n", feature_vector)

    return feature_vector
