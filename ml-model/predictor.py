import os
import json
import pandas as pd
from prophet import Prophet
from pymongo import MongoClient
from datetime import datetime, timedelta
# import matplotlib.pyplot as plt
# import pytz

def predict():
    try:
        # Variables de entorno
        U = os.getenv("U")
        P = os.getenv("P")
        uri = f"mongodb+srv://{U}:{P}@cluster0.su9cocn.mongodb.net/test?retryWrites=true&w=majority"

        # Conexión
        client = MongoClient(uri)
        db = client["test"]
        collection = db["sales"]

        # Obtener data
        data = list(collection.find({}))
        if not data:
            raise ValueError("No se encontraron datos")

        df = pd.DataFrame(data)

        # ⏰ Convertir a zona horaria de Puerto Rico
        df["Date"] = pd.to_datetime(df["Date"], utc=True)  # Asegura que esté en UTC
        df["Date"] = df["Date"].dt.tz_convert("America/Puerto_Rico")  # Convertir a PR
        df["Date"] = df["Date"].dt.date  # Eliminar hora (queda como fecha local)
        df["Date"] = pd.to_datetime(df["Date"])  # Volver a datetime sin zona para Prophet

        # Agrupar por día
        df = df.groupby("Date").agg({"Total": "sum"}).reset_index()
        df.columns = ["ds", "y"]

        # Crear y entrenar modelo
        model = Prophet()
        model.fit(df)

        # Generar predicción para hoy + 7 días (incluye hoy)
        future = model.make_future_dataframe(periods=8)
        forecast = model.predict(future)

        # Graficar componentes
        # model.plot_components(forecast)
        # plt.show()

        today = pd.Timestamp(datetime.now().date())
        end_date = today + pd.Timedelta(days=7)

        resultado = forecast[["ds", "yhat"]]
        resultado = resultado[resultado["ds"].between(today, end_date)]

        # Día de la semana
        dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        resultado["weekday"] = resultado["ds"].dt.dayofweek.apply(lambda x: dias_semana[x])

        # Formato JSON
        resultado = resultado.to_dict(orient="records")
        resultado = sorted(resultado, key=lambda x: x["ds"])  # orden cronológico

        print(json.dumps(resultado, default=str))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    predict()
