import { useState, useRef, useEffect } from 'react';
import "../styles/feedback/pickme_selected_list.css";

export const PickMeSelectedList = ({ 
    label, 
    items,      
    selectedItem, 
    setSelectedItem,
    disabled = false,
    placeholder = 'Выберите...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Закрытие при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        if (!disabled) {
            setSelectedItem(item);
            setIsOpen(false);
        }
        console.log(`Выбран: ${item};;;;;;${item.displayValue}`)
    };

    return (
        <div className={`custom-select ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
            <label className="custom-select-label">{label}</label>
            <div className="selected-list" onClick={() => !disabled && setIsOpen(!isOpen)}>
                <p className={!selectedItem ? 'placeholder' : ''}>
                    {selectedItem?.displayValue || placeholder}
                </p>
                <div className="select-btn">▼</div>
            </div>
            
            {isOpen && !disabled && (
                <div className="dropdown-list">
                    {items.length === 0 ? (
                        <div className="dropdown-empty">Нет доступных вариантов</div>
                    ) : (
                        items.map((item) => (
                            <div 
                                key={item.id}
                                className={`dropdown-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                                onClick={() => handleSelect(item)}
                            >
                                {item.displayValue}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};