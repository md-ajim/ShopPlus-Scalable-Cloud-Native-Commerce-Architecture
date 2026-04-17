import firebase_admin
from firebase_admin import credentials

card =credentials.Certificate("firebase-service-account.json")

firebase_admin.initialize_app(card)