import pandas as pd
from sklearn.model_selection import train_test_split
from logisticRegression import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle

data = pd.read_csv("emails.csv")

X = data.drop(columns=['Email No.', 'Prediction'])
y = data['Prediction']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=1234)

model = LogisticRegression()
model.fit(X_train, y_train)

# save fitted model as a file
with open('logistic_regression_model.pkl', 'wb') as file:
    pickle.dump(model, file)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred) * 100
print(f'Accuracy: {accuracy}%')