function formatNumber(value)
{
    const n = Number(value);

    if (isNaN(n))
        return "-";

    return n.toLocaleString();
}

function formatGDP(value)
{
    const gdp = Number(value);

    if (isNaN(gdp) || gdp <= 0)
        return "-";

    return `${gdp.toLocaleString()} triệu USD`;
}

function calculateGDPPerCapita(
    gdp,
    population
)
{
    const g =
        Number(gdp);

    const p =
        Number(population);

    if (
        isNaN(g) ||
        isNaN(p) ||
        p === 0
    )
    {
        return "-";
    }

    const result =
        (g * 1000000) / p;

    return Math.round(
        result
    ).toLocaleString() +
    " USD";
}

function showCountry(country)
{
    const flag =
        `flags/${country.iso2.toLowerCase()}.svg`;

    document.getElementById(
        "countryInfo"
    ).innerHTML = `

    <div class="country-sections">

        <!-- CỘT 1 -->

        <div class="country-section">

            <div class="country-header">

                <img
                    class="country-flag"
                    src="${flag}"
                    alt="${country.name}"
                >

                <div class="country-name">
                    ${country.name}
                </div>

            </div>

            <div class="info-row">
                <span>Thủ đô</span>
                <strong>${country.capital}</strong>
            </div>

            <div class="info-row">
                <span>Châu lục</span>
                <strong>${country.region}</strong>
            </div>

            <div class="info-row">
                <span>Diện tích</span>
                <strong>
                    ${formatNumber(
                        country.area_sq_km
                    )} km²
                </strong>
            </div>

        </div>

        <!-- CỘT 2 -->

        <div class="country-section">

            <div class="info-row">
                <span>Tiền tệ</span>
                <strong>
                    ${country.currency}
                    (${country.currency_name})
                </strong>
            </div>

            <div class="info-row">
                <span>GDP</span>
                <strong>
                    ${formatGDP(
                        country.gdp
                    )}
                </strong>
            </div>

            <div class="info-row">
                <span>Dân số</span>
                <strong>
                    ${formatNumber(
                        country.population
                    )}
                </strong>
            </div>

            <div class="info-row">
                <span>GDP/người</span>
                <strong>
                    ${calculateGDPPerCapita(
                        country.gdp,
                        country.population
                    )}
                </strong>
            </div>

        </div>

        <!-- CỘT 3 -->

        <div class="country-section">

            <div class="future-item">
                Chính trị
            </div>

            <div class="future-item">
                Kinh tế
            </div>

            <div class="future-item">
                Xuất nhập khẩu
            </div>

            <div class="future-item">
                Quan hệ quốc tế
            </div>

        </div>

    </div>
    `;
}