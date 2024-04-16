import pandas as pd
from func_defs import preprocess, vectorize
from sklearn.model_selection import train_test_split
from logisticRegression import LogisticRegression
# from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
import pickle

file_exists = input("Use existing model? y/n: ")

if file_exists == "y":

    with open('logistic_regression_model.pkl', 'rb') as file:
        model = pickle.load(file)
    # end if

else:

    data = pd.read_csv("emails.csv")

    X = data.drop(columns=['Email No.', 'Prediction'])

    # need to extract all column labels into a list
    labels = data.columns.tolist()

    # Drop "Email No" and "Prediction"
    labels = labels[1:-1]

    # print("Labels:\n", labels)
    # print(len(labels)) # 3000
    # with open('column_labels.txt', 'w') as f:
        # for label in labels:
            # f.write("%s\n" % label)


    y = data['Prediction']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=1234)

    # print(X_test)

    model = LogisticRegression()
    model.fit(X_train, y_train)

    # save fitted model as a file
    with open('logistic_regression_model.pkl', 'wb') as file:
        pickle.dump(model, file)
    # end else

# y_pred = model.predict_proba(X_test)

# print("Raw y_pred:\n", y_pred)
# print(len(y_pred))

#accuracy = accuracy_score(y_test, y_pred) * 100
# print(f'Accuracy: {accuracy}%')
        
# PLACEHOLDER: enter way to get raw email text
raw_email = input("Enter the raw email text: ")

feature_vector = vectorize(raw_email)

probability = model.predict_proba(feature_vector)

# must make this a function to return thus probability
# return round(probability[2]*100, 2)

print("Spam Probability: ", round(probability[2]*100, 2), "%")