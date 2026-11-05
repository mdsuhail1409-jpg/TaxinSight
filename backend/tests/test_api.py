import pytest
import io
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
    assert data["data"]["kpis"]["corporation_tax"]["value"] > 0
    assert data["data"]["kpis"]["personal_income_tax"]["value"] > 0


def test_revenue_analytics():
    response = client.get("/api/analytics/revenue")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["time_series"]) > 0
    # verify contribution calculation
    item = data["data"]["time_series"][-1]
    assert item["corporate_tax_contribution_pct"] is not None
    assert item["personal_tax_contribution_pct"] is not None


def test_regional_analytics():
    response = client.get("/api/analytics/regional")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]["top_contributing_states"]) > 0
    assert data["data"]["concentration_metrics"]["top_3_states_share_pct"] > 0


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
    assert data["data"]["distribution_moments"]["mean_taxable_income_inr"] > 0
    assert data["data"]["distribution_moments"]["variance"] > 0
    assert data["data"]["distribution_moments"]["standard_deviation"] > 0
    assert len(data["data"]["correlations"]) > 0
    assert len(data["data"]["iqr_outlier_analysis"]) > 0


def test_data_quality_analytics():
    response = client.get("/api/analytics/data-quality")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["reconciliation_status"]["status"] == "PASSED"
    assert data["data"]["overall_health_score"] >= 95.0


def test_datasets_list():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 1


def test_upload_invalid_extension():
    # Attempting to upload a .exe or .py should be rejected with HTTP 400
    file_content = b"fake binary payload"
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("malicious_script.exe", io.BytesIO(file_content), "application/octet-stream")}
    )
    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]


def test_upload_valid_csv():
    csv_content = b"financial_year,collection\n2022-23,1000\n"
    response = client.post(
        "/api/datasets/upload",
        files={"file": ("test_upload.csv", io.BytesIO(csv_content), "text/csv")},
        data={"description": "Automated test dataset upload"}
    )
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["data"]["filename"] == "test_upload.csv"


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
