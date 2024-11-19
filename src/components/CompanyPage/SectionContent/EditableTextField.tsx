import React, { useState, useRef, useEffect } from 'react';
import { keyframes, styled } from 'styled-components';
import {Company, Section, SectionContent} from '@/utils/interface'
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {callApi} from "@/utils/api";


interface EditableTextFieldProps {
    selectedCompany: Company | null;
    section?: Section | null;
    sectionContent?: SectionContent | null;
    id: string | undefined;
    text?: string;
    type?: string;
    placeholder?: string;
    onSuccess?: () => void;
}

const EditableTextField: React.FC<EditableTextFieldProps> = ({ onSuccess, selectedCompany, section, sectionContent, id, text, placeholder, type }) => {
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
        if (!hasEdited || isSaving || !selectedCompany) return;
        setIsSaving(true);
        let url = '';
        let body = {};
        if (sectionContent && section && sectionContent.type === "subsection") {
            url = `/api/companies/${selectedCompany?._id}/sections/${section._id}/content/${sectionContent._id}`;
            body = {
                type: "subsection",
                subSection: {
                    name: textField,
                }
            };
        } else if (sectionContent && section) {
            url = `/api/companies/${selectedCompany?._id}/sections/${section._id}/content/${sectionContent._id}`;
            body = {
                type: 'text',
                textField: {
                    text: textField
                }
            };
        } else if (section) {
            url = `/api/companies/${selectedCompany?._id}/sections/${section._id}`;
            body = {
                name: textField,
            };
        } else if (type === "orgnr") {
            url = `/api/companies/${selectedCompany._id}`;
            body = {
                organisasjonsnummer: textField,
            };
        } else if (type === "companydescription") {
            url = `/api/companies/${selectedCompany._id}`;
            body = {
                description: textField,
            };
        }
        console.log("Saving with body:", body);
        callApi<void>(url, 'PUT', body).then(() => {
            setHasEdited(false);
            if (onSuccess) onSuccess();
        }).catch((e: Error) => {
            console.error('Failed to update text:', e);
        }).finally(() => {
            setIsSaving(false);
        })
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
        handleSaveText().then(() => {
            if (!isSaving) setIsEditing(false);
        });
    };

    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            handleSaveText().then();
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
                    onChange={(e: { target: { value: React.SetStateAction<string | undefined>; }; }) => {
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
  width: 100%;
  box-sizing: border-box;
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
  border: ${({ $hasEdited }) => $hasEdited ? '1px dashed blue' : '1px dotted #ccc'};
  font-family: inherit;
  font-size: inherit;
  overflow: hidden;
  background: inherit;
  color: inherit;
  width: 100%;
  border-radius: 2px;
  outline: none;
    line-height: 1.2rem;
`;

const Text = styled.div`
  padding: 0.5rem;
  border: 1px solid transparent;
  font-size: inherit;
  cursor: pointer;
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
    line-height: 1.2rem;
  &:hover {
    border: 1px dashed #ccc;
  }
`;