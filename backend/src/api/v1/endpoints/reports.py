from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, datetime
from src.core.db_helper import db_helper
from src.services import report_service
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
        
        pdf_content = await report_service.generate_services_report(session, start_datetime, end_datetime)
        
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
    

@router.get("/employees")
async def get_employees_report(
    start_date: date | None = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: date | None = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        start_datetime = datetime.combine(start_date, datetime.min.time()) if start_date else None
        end_datetime = datetime.combine(end_date, datetime.max.time()) if end_date else None
        
        pdf_content = await report_service.generate_employees_report(session, start_datetime, end_datetime)
        
        filename = generate_filename("employees", start_date, end_date)
        
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
    

@router.get("/rooms")
async def get_rooms_report(
    start_date: date | None = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: date | None = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        start_datetime = datetime.combine(start_date, datetime.min.time()) if start_date else None
        end_datetime = datetime.combine(end_date, datetime.max.time()) if end_date else None
        
        pdf_content = await report_service.generate_rooms_report(session, start_datetime, end_datetime)
        
        filename = generate_filename("rooms", start_date, end_date)
        
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