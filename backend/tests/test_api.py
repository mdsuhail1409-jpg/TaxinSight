import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "kpis" in data["data"]
    assert data["data"]["kpis"]["net_collection"]["value"] > 0


def test_revenue_analytics():
    response = client.get("/api/analytics/revenue")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["time_series"]) > 0


def test_regional_analytics():
    response = client.get("/api/analytics/regional")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["top_contributing_states"]) > 0


def test_itr_analytics():
    response = client.get("/api/analytics/itr")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["form_distribution"]) > 0


def test_statistical_analytics():
    response = client.get("/api/analytics/statistics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["inequality_metrics"]["gini_coefficient"] > 0
    assert len(data["data"]["lorenz_curve"]) > 0


def test_data_quality_analytics():
    response = client.get("/api/analytics/data-quality")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["reconciliation_status"]["status"] == "PASSED"


def test_datasets_list():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_report_pdf():
    response = client.get("/api/reports/pdf")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 1000


def test_report_excel():
    response = client.get("/api/reports/excel")
    assert response.status_code == 200
    assert "spreadsheetml" in response.headers["content-type"]
    assert len(response.content) > 1000
