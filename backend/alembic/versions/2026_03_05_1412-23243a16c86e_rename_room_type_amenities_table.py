"""rename room_type_amenities table

Revision ID: 23243a16c86e
Revises: 2d8be20d5223
Create Date: 2026-03-05 14:12:17.572392

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "23243a16c86e"
down_revision: Union[str, Sequence[str], None] = "2d8be20d5223"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Переименовываем таблицу
    op.rename_table('room_type_amenities', 'room_type_amenities_association')

def downgrade() -> None:
    # Обратное переименование
    op.rename_table('room_type_amenities_association', 'room_type_amenities')
