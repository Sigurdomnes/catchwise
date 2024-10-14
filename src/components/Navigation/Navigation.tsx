import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faPlus, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { TextField, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCompanies } from '../../redux/companies/companySlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Company } from '../../utils/interface'

function Navigation() {
    const [newCompanyName, setNewCompanyName] = React.useState("");
    const [showInput, setShowInput] = React.useState(false);
    const companies = useSelector((state: RootState) => state.company.companies);
    const [visibleSettingsCompanyId, setVisibleSettingsCompanyId] = useState<string | null | undefined>(null);
    const [isArchivedVisible, setIsArchivedVisible] = useState(false);
    const dispatch = useDispatch();

    const router = useRouter();
    const currentPath = usePathname();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies');
            const data = await res.json();
            if (res.status === 200) {
                if (Array.isArray(data.companies)) {
                    dispatch(setCompanies(data.companies));
                    console.log("Fetched:", data)
                }
            } else {
                console.error(res.json)
            }
        } catch (error) {
            console.error(error)
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCompanyName
                })
            });

            const data = await res.json();
            if (res.status === 201) {
                console.log("Submitted:", data)
                fetchCompanies();
                setShowInput(false);
            } else {
                console.log("Error:", res.json)
            }
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    const handleCompanyClick = (company: Company) => {
        router.push(`/company/${company._id}`)
    }

    const toggleArchivedVisibility = () => {
        setIsArchivedVisible(!isArchivedVisible);
    };

    const handleSettingsClick = (companyId: string | undefined) => {
        setVisibleSettingsCompanyId((prevCompanyId) => (prevCompanyId === companyId ? null : companyId));
    };

    const handleArchiveClick = async (company: Company) => {
        try {
            let setArchive = false;
            if (company.archived === false || company.archived === undefined) { setArchive = true }
            const response = await fetch(`/api/companies/${company._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    archived: setArchive,
                }),
            });

            if (response.ok) {
                console.log('Company archived successfully');
                fetchCompanies();
            } else {
                console.error('Failed to archive company');
            }
        } catch (error) {
            console.error('Error archiving company:', error);
        }
    };

    const handleDeleteClick = async (companyId: string | undefined) => {
        try {
            const response = await fetch(`/api/companies/${companyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Company deleted successfully');
                fetchCompanies();
            } else {
                console.error('Failed to delete company');
            }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const clearCompanies = async () => {
        try {
            const res = await fetch('/api/companies', {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.status === 200) {
                console.log("Database cleared:", data);
                fetchCompanies();
            } else {
                console.error("Failed to clear companies:", data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Nav>
            <Section>
                <H1>ESG-rapporter</H1>
                <H2>Bedrifter:</H2>
                {companies
                    .filter((company) => company.archived !== true)
                    .map((company) => (
                        <CompanyList key={company._id}>
                            <ListItem
                                onClick={() => {
                                    handleCompanyClick(company)
                                }}
                                isActive={`/company/${company._id}/` === currentPath}
                            ><FontAwesomeIcon icon={faBriefcase} />
                                {company.name}
                                <CollapseIcon
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSettingsClick(company._id);
                                    }}
                                    icon={visibleSettingsCompanyId === company._id ? faChevronUp : faChevronDown} />
                            </ListItem>
                            {visibleSettingsCompanyId === company._id && (
                                <SettingsButton bgColor='#444' onClick={() => handleArchiveClick(company)}>Arkiver</SettingsButton>
                            )
                            }
                        </CompanyList>
                    ))}
                <H2 onClick={toggleArchivedVisibility} style={{ cursor: 'pointer' }}>
                    Arkiverte ({companies.filter((company) => company.archived === true).length}):
                    <CollapseIcon icon={isArchivedVisible ? faChevronUp : faChevronDown} />
                </H2>
                {isArchivedVisible && (
                    <>
                        {companies
                            .filter((company) => company.archived === true)
                            .map((company) => (
                                <CompanyList key={company._id}>
                                    <ListItem
                                        onClick={() => {
                                            handleCompanyClick(company)
                                        }}
                                        isActive={currentPath === `/company/${company._id}/`}
                                    >
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        {company.name}
                                        <CollapseIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSettingsClick(company._id);
                                            }}
                                            icon={visibleSettingsCompanyId === company._id ? faChevronUp : faChevronDown} />
                                    </ListItem>
                                    {visibleSettingsCompanyId === company._id && (
                                        <>
                                            <SettingsButton bgColor='#444' hoverColor='darkgreen' onClick={() => handleArchiveClick(company)}>Gjenopprett</SettingsButton>
                                            <SettingsButton onClick={() => handleDeleteClick(company._id)}>Slett</SettingsButton>
                                        </>
                                    )
                                    }
                                </CompanyList>
                            ))}
                    </>
                )}
            </Section>
            <AddCompanyButton onClick={() => setShowInput(!showInput)}><FontAwesomeIcon icon={faPlus} />Legg til bedrift</AddCompanyButton>
            {showInput && (
                <Form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <TextField
                        label="Bedriftsnavn"
                        variant="outlined"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        required
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Legg til
                    </Button>
                </Form>
            )}
            <Button onClick={clearCompanies} style={{ position: 'absolute', bottom: '0', color: 'var(--cwcolor)' }}>
                Clear database
            </Button>
        </Nav>
    )
}

export default Navigation

const Nav = styled.nav`
    width: 20rem;
    height: calc(100vh - 3rem);
    border-right: 1px solid #ccc;
    padding: 0 1rem;
    z-index: 2;
    display: flex;
    flex-direction: column;
`

const Section = styled.section`
    display: flex;
    color: var(--cwcolor);
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
`
const H1 = styled.h1`
    text-align: center;
    border-top: 1px solid var(--cwcolor);
    border-bottom: 1px solid var(--cwcolor);
    padding: 1rem;
`

const H2 = styled.h2`
    font-size: 1rem;
    margin: .5rem 0 0;
    display: flex;
    font-size: .9rem;
    background: var(--cwcolor);
    color: #ccc;
    padding: .5rem 1rem;
    border-radius: 5px;
    user-select: none;
`

const CompanyList = styled.ul`
    list-style: none;
`

const ListItem = styled.li<{ isActive: boolean }>`
    padding: 1rem;
    display: flex;
    gap: .5rem;
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid var(--cwcolor);;
    border-radius: 5px;
    cursor: pointer;
    background: ${({ isActive }) => (isActive ? "#333" : "transparent")};
    color: ${({ isActive }) => (isActive ? "#ccc" : "var(--cwcolor)")};
    transition: .2s ease;
    &:hover {
        transform: scale(1.025);
        background: #333;
        color: #ccc;
    }
`

const AddCompanyButton = styled.button`
    position: absolute;
    bottom: 2rem;
    width: 18rem;
    background: darkgreen;
    color: #ccc;
    padding: 1rem;
    display: flex;
    gap: .5rem;
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid #444;
    border-radius: 5px;
    cursor: pointer;
    transition: .2s ease;
    &:hover {
        transform: scale(1.025);
        border: 1px solid var(--cwcolor);
        color: var(--cwcolor);
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    input {
    color: #555;
    }
    button {
        height: 2.8rem;
        background: var(--cwcolor);
        :hover {
            transform: scale(1.025)
        }
    }
`

const CollapseIcon = styled(FontAwesomeIcon)`
  margin-left: auto;
  margin-top: -.2rem;
  border-radius: 50%;
  padding: .2rem;
  &:hover {
    background: #fff;
    color: var(--cwcolor);
  }
`;

const SettingsButton = styled.button<{bgColor?: string; hoverColor?: string}>`
  padding: .5rem 1rem;
  margin: .75rem 0 0 .5rem;
  cursor: pointer;
  background-color: ${({ bgColor }) => bgColor || '#580000'};
  color: white;
  border: none;
  border-radius: 4px;
  user-select: none;
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || 'darkred'};
  }
`
