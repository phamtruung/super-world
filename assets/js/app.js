/**
 * Khởi động hệ thống
 */
async function init()
{
    if(window.innerWidth < 768)
    {
        document.body.classList.add(
            "panel-bottom"
        );
    }

    try
    {
        console.log(
            "Loading countries.csv..."
        );

        await loadCountries();

        console.log(
            "Countries loaded:",
            Object.keys(
                countriesData
            ).length
        );

        console.log(
            "Loading map..."
        );

        await initializeMap();

        console.log(
            "World Atlas ready"
        );
    }
    catch(error)
    {
        console.error(
            "Application startup failed:",
            error
        );

        document.getElementById(
            "countryInfo"
        ).innerHTML = `
            <div style="color:red">
                Không thể khởi động ứng dụng.
                <br>
                ${error.message}
            </div>
        `;
    }
}
const toggleButton =
    document.getElementById(
        "togglePanel"
    );

if(toggleButton)
{
    toggleButton.addEventListener(
        "click",
        () =>
        {
            document.body.classList.toggle(
                "panel-bottom"
            );

            const mode =
                document.body.classList.contains(
                    "panel-bottom"
                )
                ? "bottom"
                : "right";

            localStorage.setItem(
                "panel-mode",
                mode
            );
        }
    );
}
/**
 * Chờ DOM load xong
 */
document.addEventListener(
    "DOMContentLoaded",
    init
);