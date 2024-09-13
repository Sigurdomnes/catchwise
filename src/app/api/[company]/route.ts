import { companies } from "../data/data"

export async function GET(
    _request: Request,
    { params }: { params: {company: string} }
) {
    const company = companies.find(
        (company) => company.id === params.company
    );
    return Response.json(company);
}