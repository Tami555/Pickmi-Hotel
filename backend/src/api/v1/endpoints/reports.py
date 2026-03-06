from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from src.core.db_helper import db_helper
from src.services.report_service import generate_services_report


router = APIRouter()


@router.get("/services")
async def get_services_report(
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    """ Скачать отчет по услугам в PDF формате """
    try:
        pdf_content = await generate_services_report(start_date, end_date, session)
        filename = f"services_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={ "Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при генерации отчета: {str(e)}")