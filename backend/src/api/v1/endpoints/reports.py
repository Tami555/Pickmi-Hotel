from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, datetime
from src.core.db_helper import db_helper
from src.services.report_service import generate_services_report


router = APIRouter()


# @router.get("/services")
# async def get_services_report(
#     start_date: datetime | None = None,
#     end_date: datetime | None = None,
#     session: AsyncSession = Depends(db_helper.create_scoped_session)
# ):
#     """ Скачать отчет по услугам в PDF формате """
#     try:
#         pdf_content = await generate_services_report(start_date, end_date, session)
#         filename = f"services_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
#         return Response(
#             content=pdf_content,
#             media_type="application/pdf",
#             headers={ "Content-Disposition": f"attachment; filename={filename}"}
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Ошибка при генерации отчета: {str(e)}")
@router.get("/services")
async def get_services_report(
    start_date: date | None = Query(None, description="Начальная дата (YYYY-MM-DD)"),
    end_date: date | None = Query(None, description="Конечная дата (YYYY-MM-DD)"),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        # Конвертируем date в datetime если нужно
        start_datetime = datetime.combine(start_date, datetime.min.time()) if start_date else None
        end_datetime = datetime.combine(end_date, datetime.max.time()) if end_date else None
        
        pdf_content = await generate_services_report(session, start_datetime, end_datetime)
        
        # Формируем имя файла
        period_str = ""
        if start_date and end_date:
            period_str = f"_{start_date}_{end_date}"
        elif start_date:
            period_str = f"_from_{start_date}"
        elif end_date:
            period_str = f"_to_{end_date}"
            
        filename = f"services_report{period_str}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
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