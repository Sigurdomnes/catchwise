import React, { useState, useRef, useEffect } from 'react';
import { styled } from 'styled-components';
import { Company, Section, SectionContent } from '../../utils/interface'

interface EditableTextFieldProps {
    selectedCompany: Company | null;
    section?: Section | null;
    sectionContent?: SectionContent | null;
    id: string | undefined;
    text?: string;
    placeholder?: string;
    onSuccess?: () => void;
}

const EditableTextField: React.FC<EditableTextFieldProps> = ({ onSuccess, selectedCompany, section, sectionContent, id, text, placeholder }) => {
    const [textField, setTextField] = useState<string | undefined>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (text !== undefined) {
            setTextField(text);
        }
    }, [text])


    const handleSaveText = async () => {
        setIsSaving(true);
        try {
            let url = '';
            let body = {};
            if (section && sectionContent) {
                url = `/api/companies/${selectedCompany?._id}/sections/${section._id}`;
                body = {
                    id: sectionContent._id,
                    textField: textField,
                };
            } else if (section) {
                url = `/api/companies/${selectedCompany?._id}/sections/${section._id}`;
                body = {
                    id: section._id,
                    name: textField,
                    type: 'text',
                };
            } else if (selectedCompany) {
                url = `/api/companies/${selectedCompany._id}`;
                body = {
                    id: selectedCompany._id,
                    description: textField,
                };
            }
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                if (onSuccess) onSuccess();
                setIsEditing(false);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 2000);
            } else {
                const errorData = await response.json();
                console.error('Failed to update text:', errorData);
                alert(`Failed to update text: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating text:', error);
            alert('An error occurred while updating the text.');
        }
        setIsSaving(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (textareaRef.current) {
                adjustTextareaSize();
                const length = textareaRef.current.value.length;
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    const adjustTextareaSize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.style.width = `${textareaRef.current.scrollWidth}px`;
        }
    };

    const handleBlur = () => {
        if (!isSaving) setIsEditing(false);
    };


    return (
        <Container key={id}>
            {isEditing ? (
                <EditableTextarea
                    ref={textareaRef}
                    value={textField}
                    onChange={(e) => {
                        setTextField(e.target.value);
                        adjustTextareaSize();
                    }}
                    rows={1}
                    onBlur={handleBlur}
                    placeholder={`Skriv din ${placeholder ? placeholder : 'tekst'} her...`}
                    autoFocus
                />
            ) : (
                <Text onClick={handleEditClick}>
                    {text || `Klikk her for å legge til ${placeholder ? placeholder : 'tekst'}`}
                </Text>
            )}
            {isEditing && (
                <SaveButton
                    onMouseDown={() => setIsSaving(true)}
                    onClick={handleSaveText}
                >Lagre tekst</SaveButton>
            )}
            {showSuccessMessage && <SuccessMessage>Lagret!</SuccessMessage>}
        </Container>
    );
};

export default EditableTextField;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const EditableTextarea = styled.textarea`
  font-weight: inherit;
  padding: 0.5rem;
  margin: 1rem 0 0;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
  width: 50vw;
  overflow: hidden;
  background: inherit;
  color: inherit;
  outline: none;
  &:hover {
    border: 1px dashed #ccc;
  }
`;

const Text = styled.div`
  padding: 0.5rem;
  margin: 1rem 0;
  border: 1px solid transparent;
  font-size: inherit;
  cursor: pointer;
  text-align: center;
  white-space: pre-wrap;
  &:hover {
    border: 1px dashed #ccc;
  }
`;

const SuccessMessage = styled.div`
  font-weight: 600;
  padding: .5rem 1rem;
  background: green;
  color: white;
  border-radius: 4px;
  position: absolute;
  text-align: center;
  font-size: 1rem;
  right: 2rem;
  top: 1rem;
`;

const SaveButton = styled.button`
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: darkgreen;
    color: white;
    border: none;
    height: 2.5rem;
    width: 30%;
    align-self: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: darkgreen;
    }
`;