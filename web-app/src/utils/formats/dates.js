// преобразуют строку даты из формата ISO 8601

export const formatDateToRussian = (dateString) => {
    // в вид: 11 декабря 2025 г.
        return new Date(dateString)
            .toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
    };

export const formatToRussianDateTime = (dateString) => {
    // в вид: 11 декабря 2025 г., 22:48
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    };