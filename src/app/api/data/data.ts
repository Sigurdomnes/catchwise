export interface Table1 {
    id: number;
    navn: string;
    antall: number;
    sted: string;
}

export interface Table2 {
    id: number;
    name: string;
    value: number;
}

export interface Tables {
    id: string;
    tableheader: string;
    table: Table1[] | Table2[];
}

export interface CompanyData {
    id: string;
    navn: string;
    beskr: string;
    tables: Tables[];
}

export const companies = [
    {
        "id": "bluewild",
        "navn": "Bluewild AS",
        "beskr": "Info Bluewild",
        "tables": [
            {
                "id": 1,
                "tableheader": "Statistikk over fisk",
                "table": [
                    {
                        "id": 1,
                        "navn": "Torsk",
                        "antall": 19560,
                        "sted": "Lofoten"
                    },
                    {
                        "id": 2,
                        "navn": "Hyse",
                        "antall": 19335,
                        "sted": "Barentshavet"
                    },
                    {
                        "id": 3,
                        "navn": "Sei",
                        "antall": 1934650,
                        "sted": "Vestfjorden"
                    }
                ]
            },
            {
                "id": 2,
                "tableheader": "Sosiale forhold",
                "table": [
                    {
                        "id": 1,
                        "name": "Antall ansatte",
                        "value": 133
                    },
                    {
                        "id": 2,
                        "name": "Antall kvinner",
                        "value": 17
                    },
                    {
                        "id": 3,
                        "name": "Antall menn1",
                        "value": 116
                    }
                ]
            }
        ],
    },
    {
        "id": "fishandchips",
        "name": "FishAndChips AS",
        "description": "Info Fish and chips",
        "tables": [
            {
                "id": 1,
                "tableheader": "Statistikk over fisk",
                "table": [
                    {
                        "id": 1,
                        "navn": "Torsk",
                        "antall": 19560,
                        "sted": "Lofoten"
                    },
                    {
                        "id": 2,
                        "navn": "Hyse",
                        "antall": 19335,
                        "sted": "Barentshavet"
                    },
                    {
                        "id": 3,
                        "navn": "Sei",
                        "antall": 1934650,
                        "sted": "Vestfjorden"
                    }
                ]
            },
            {
                "id": 2,
                "tableheader": "Sosiale forhold",
                "table": [
                    {
                        "id": 1,
                        "name": "Antall ansatte",
                        "value": 133
                    },
                    {
                        "id": 2,
                        "name": "Antall kvinner",
                        "value": 17
                    },
                    {
                        "id": 3,
                        "name": "Antall menn1",
                        "value": 116
                    }
                ]
            }
        ],
    }
]