import CompanyLogo from "@/components/CompanyPage/FrontPage/CompanyLogo";
import EditableTextField from "@/components/CompanyPage/SectionContent/EditableTextField";
import {styled} from "styled-components";
import {useParams} from "next/navigation";
import {callApi} from "@/utils/api";
import {Company} from "@/utils/interface";
import {setCompanies} from "@/redux/companies/companySlice";
import {useDispatch} from "react-redux";
import {CatchWiseLogo} from "@/assets/catchwiselogo";
import CompanyData from "@/components/CompanyPage/FrontPage/CompanyData";

interface FrontPageProps {
    currentCompany: Company | null;
}

function FrontPage({currentCompany}: FrontPageProps) {
    const companyId = useParams<{ id: string }>().id
    const dispatch = useDispatch();

    const fetchCompaniesFromDatabase = () => {
        callApi<Company[]>('api/companies')
            .then((companies) => {
                dispatch(setCompanies(companies));
            }).catch((e: Error) => {
            console.log("Error fetching companies:", e)
        });
    }

    return (
        <FrontPageContainer>
            <h2>ESG-rapport</h2>
            <H1>{currentCompany?.name || "Company Name"}</H1>
            <h2>2024</h2>
            <CompanyLogo companyId={companyId} companyLogoUrl={currentCompany?.logoUrl}/>
            <OrgNummerContainer>
                Organisasjonsnummer: 123456789
{/*                <EditableTextField
                    key={companyId}
                    id={companyId}
                    onSuccess={fetchCompaniesFromDatabase}
                    selectedCompany={currentCompany}
                    type={"orgnr"}
                    text={"0923463456"}
                />*/}
            </OrgNummerContainer>
            <br/>
            <CompanyData/>
            <ESGDescription>
                <ESGBullet>E</ESGBullet><p>Environmental (miljø)</p>
                <ESGBullet>S</ESGBullet><p>Social (sosiale forhold)</p>
                <ESGBullet>G</ESGBullet><p>Governance (selskapsstyring)</p>
            </ESGDescription>
            <br/>
            <CompanyDescriptionContainer><EditableTextField onSuccess={fetchCompaniesFromDatabase}
                                                            selectedCompany={currentCompany} id={companyId}
                                                            type={"companydescription"}
                                                            text={currentCompany?.description}
                                                            placeholder={"beskrivelse"}/></CompanyDescriptionContainer>
            <CWLogoContainer>
                <p>Utarbeidet av</p>
                <CatchWiseLogo/>
            </CWLogoContainer>
        </FrontPageContainer>
    );
}

export default FrontPage;

const FrontPageContainer = styled.section`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    min-height: 1123px;
    max-height: 1123px;
    padding: 3rem 0;
    color: #111;
`

const CWLogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--cwcolor);
    margin-top: auto;
    
    p {
        font-weight: 600;
        font-size: .8rem;
    }
`

const H1 = styled.h1`
    letter-spacing: .2rem;
    font-size: 2.5rem;
    color: var(--cwcolor);
`

const OrgNummerContainer = styled.div`
    display: flex;
    align-items: center;
`

const ESGDescription = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: .5rem 1rem;
    font-size: .95rem;
    width: 100%;
`

const ESGBullet = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cwcolor);
    font-weight: 600;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    color: #fff;
`
const CompanyDescriptionContainer = styled.div`
    width: 100%;
    margin: 0 0 .5rem;
`