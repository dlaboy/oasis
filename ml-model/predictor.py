import os
import json
import pandas as pd
from prophet import Prophet
from pymongo import MongoClient
from datetime import datetime, timedelta

def predict():
    try:
        # Credenciales desde variables de entorno
        U = os.getenv("U")
        P = os.getenv("P")
        uri = f"mongodb+srv://{U}:{P}@cluster0.su9cocn.mongodb.net/test?retryWrites=true&w=majority"

        # Conexión a MongoDB
        client = MongoClient(uri)
        db = client["test"]
        collection = db["sales"]

        # Obtener los datos
        data = list(collection.find({}))
        if not data:
            raise ValueError("No se encontraron datos en la colección")

        df = pd.DataFrame(data)
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date")

        # Agrupar por fecha y sumar las ventas totales por día
        df = df.groupby("Date").agg({"Total": "sum"}).reset_index()
        df.columns = ["ds", "y"]

        # Crear y entrenar el modelo Prophet
        model = Prophet()
        model.fit(df)

        # Predecir los próximos 7 días, incluyendo hoy
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        today = pd.Timestamp(datetime.now().date())
        next_week = today + pd.Timedelta(days=7)

        resultado = forecast[["ds", "yhat"]]
        resultado = resultado[resultado["ds"].between(today, next_week)]

        # Añadir el nombre del día de la semana
        resultado["weekday"] = resultado["ds"].dt.day_name()
        resultado = resultado.to_dict(orient="records")

        print(json.dumps(resultado, default=str))  # Asegurar conversión de Timestamp

    except Exception as e:
        # Si ocurre un error, devolver un JSON válido con el error
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    predict()
