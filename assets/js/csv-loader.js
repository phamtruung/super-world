let countriesData = {};

async function loadCountries()
{
    const response =
        await fetch(
            "data/countries.csv"
        );

    const csv =
        await response.text();

    const lines =
        csv.trim().split("\n");

    const headers =
        lines[0]
        .split(",")
        .map(h => h.trim());

    for(let i = 1; i < lines.length; i++)
    {
        const values =
            lines[i].split(",");

        const obj = {};

        headers.forEach(
            (header,index) =>
            {
                obj[header] =
                    values[index]
                    ? values[index].trim()
                    : "";
            }
        );

        countriesData[
            obj.iso3
        ] = obj;
    }

    console.log(
        "Loaded",
        Object.keys(
            countriesData
        ).length,
        "countries"
    );
}