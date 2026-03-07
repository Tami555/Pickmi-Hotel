from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, datetime
from src.core.db_helper import db_helper
from src.services.report_service import generate_services_report
from src.utils.reports import generate_filename


router = APIRouter()


@router.get("/services")
async def get_services_report(
    start_date: date | None = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: date | None = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        start_datetime = datetime.combine(start_date, datetime.min.time()) if start_date else None
        end_datetime = datetime.combine(end_date, datetime.max.time()) if end_date else None
        
        pdf_content = await generate_services_report(session, start_datetime, end_datetime)
        
        # Генерируем имя файла
        filename = generate_filename("services", start_date, end_date)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Ошибка при генерации отчета: {str(e)}"
        )