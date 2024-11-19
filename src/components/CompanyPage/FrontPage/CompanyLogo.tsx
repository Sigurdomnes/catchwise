import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Image from 'next/image'

interface CompanyLogoProps {
    companyId: string;
    companyLogoUrl?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ companyId, companyLogoUrl }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | undefined>();
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const defaultLogoUrl = '/uploads/logos/default.svg'

    useEffect(() => {
        setLogoUrl(companyLogoUrl);
    }, [companyLogoUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            setIsUploading(true);

            const response = await fetch(`/api/companies/${companyId}/logo`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                setLogoUrl(`/uploads/logos/${result.name}`);
                console.log(result);
                setIsModalOpen(false);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            {/* Logo Display */}
            <LogoContainer onClick={() => setIsModalOpen(true)}>
                <Image
                    src={logoUrl ? `${logoUrl}` : defaultLogoUrl}
                    width={150}
                    height={150}
                    alt="Company Logo"
                    style={{cursor: 'pointer'}}
                />
                <OverlayText>Klikk for å laste opp logo</OverlayText>
            </LogoContainer>
            {isModalOpen && (
                <Modal onClick={() =>setIsModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
                        <h3>Upload a New Logo</h3>
                        <input type="file" accept="image/*" onChange={handleFileChange}/>
                        <button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default CompanyLogo;

const LogoContainer = styled.div`
    position: relative;
    display: inline-block;
    text-align: center;
`;

const OverlayText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ddd;
    width: 10rem;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;

    ${LogoContainer}:hover & {
        opacity: 1;
    }
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    margin-left: 20rem;
    text-align: center;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
`;
