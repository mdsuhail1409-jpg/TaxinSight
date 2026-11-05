import pytest
from app.services.revenue_service import calculate_yoy_growth, safe_div
from app.services.statistical_service import calculate_iqr_outliers
from app.services.dataset_service import sanitize_filename


def test_yoy_growth_formula():
    # ((Current - Previous) / Previous) * 100
    res = calculate_yoy_growth(150.0, 100.0)
    assert res == 50.0

    res_negative = calculate_yoy_growth(80.0, 100.0)
    assert res_negative == -20.0


def test_yoy_growth_zero_and_none_denominator():
    # Safe handling of zero and None
    assert calculate_yoy_growth(100.0, 0.0) is None
    assert calculate_yoy_growth(100.0, None) is None
    assert calculate_yoy_growth(None, 100.0) is None


def test_safe_div():
    assert safe_div(100.0, 50.0) == 2.0
    assert safe_div(100.0, 0.0) == 0.0
    assert safe_div(100.0, None) == 0.0
    assert safe_div(100.0, 0.0, default=99.0) == 99.0


def test_iqr_outlier_detection():
    # Normal distribution with clear high outlier
    values = [10.0, 12.0, 11.0, 13.0, 12.0, 14.0, 11.0, 100.0]
    keys = ["y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8"]
    res = calculate_iqr_outliers("TestMetric", values, keys)
    assert res.outlier_count >= 1
    assert any(o["identifier"] == "y8" for o in res.outliers)


def test_sanitize_filename():
    assert sanitize_filename("../../../etc/passwd") == "passwd"
    assert sanitize_filename("test file (1).csv") == "test_file__1_.csv"
    assert sanitize_filename("normal_dataset.xlsx") == "normal_dataset.xlsx"
