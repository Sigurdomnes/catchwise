import React, { useState, useRef, useEffect } from 'react';
import { keyframes, styled } from 'styled-components';
import { Company, Section, SectionContent } from '../../../utils/interface'
import { TextareaAutosize } from '@mui/base/TextareaAutosize';


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
    const [textField, setTextField] = useState<string | undefined>(text || '');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [hasEdited, setHasEdited] = useState<boolean>(false);

    useEffect(() => {
        if (text !== undefined) {
            setTextField(text);
        }
    }, [text])


    const handleSaveText = async () => {
        if (!hasEdited || isSaving || !selectedCompany || !id) return;
        setIsSaving(true);
        try {
            let url = '';
            let body = {};
            if (section && sectionContent) {
                url = `/api/companies/${selectedCompany?._id}/sections/${section._id}`;
                body = {
                    id: sectionContent._id,
                    textField: textField || '',
                };
            } else if (section) {
                url = `/api/companies/${selectedCompany?._id}/sections/${section._id}`;
                body = {
                    id: section._id,
                    name: textField || '',
                    type: 'text',
                };
            } else if (selectedCompany) {
                url = `/api/companies/${selectedCompany._id}`;
                body = {
                    id: selectedCompany._id,
                    description: textField || '',
                };
            }

            console.log("Saving with body:", body);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setHasEdited(false);
                if (onSuccess) onSuccess();
            } else {
                const errorData = await response.json();
                console.error('Failed to update text:', errorData);
            }
        } catch (error) {
            console.error('Error updating text:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (textareaRef.current) {
                const length = textareaRef.current.value.length;
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };


    const handleBlur = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
        handleSaveText();
        if (!isSaving) setIsEditing(false);
    };

    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            handleSaveText();
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [textField]);


    return (
        <Container key={id} placeholder={placeholder || ''}>
            {isEditing ? (
                <EditableTextarea
                    ref={textareaRef}
                    value={textField}
                    $hasEdited={hasEdited}
                    spellCheck={false}
                    onChange={(e) => {
                        setTextField(e.target.value);
                        setHasEdited(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleBlur();
                        }
                    }}
                    onBlur={handleBlur}
                    placeholder={`Skriv din ${placeholder ? placeholder : 'tekst'} her...`}
                    autoFocus
                />
            ) : (
                <Text onClick={handleEditClick}>
                    {text || `Klikk her for å legge til ${placeholder ? placeholder : 'tekst'}`}
                </Text>
            )}
        </Container>
    );
};

export default EditableTextField;

const Container = styled.div<{ placeholder: string }>`
  display: flex;
  flex-direction: column;
  width: 794px;
  box-sizing: border-box;
  margin: 1rem 0;
  > * {
    text-align: center;
  }
 ${({ placeholder }) => placeholder === 'overskrift' && `
    > * {
    text-align: left !important;
    resize: none;
  }
  `}
`

const EditableTextarea = styled(TextareaAutosize) <{ $hasEdited: boolean }>`
  font-weight: inherit;
  padding: 0.5rem;
  border: ${({ $hasEdited }) => $hasEdited ? '1px dotted #ccc' : '1px dashed blue'};
  font-family: inherit;
  font-size: inherit;
  overflow: hidden;
  background: inherit;
  color: inherit;
  width: 100%;
  max-width: 794px;
  border-radius: 2px;
  outline: none;

`;

const Text = styled.div`
  padding: 0.5rem;
  border: 1px solid transparent;
  font-size: inherit;
  cursor: pointer;
  width: 100%;
  max-width: 794px;
  text-align: center;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  &:hover {
    border: 1px dashed #ccc;
  }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
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
  bottom: 5rem;
  animation: ${fadeOut} 3s ease-in-out forwards;
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