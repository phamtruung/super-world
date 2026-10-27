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

        setupHeatmapButtons();
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

function setupHeatmapButtons()
{
    const gdpButton =
        document.getElementById(
            "toggleHeatmap"
        );

    const densityButton =
        document.getElementById(
            "toggleDensityHeatmap"
        );

    if(gdpButton)
    {
        gdpButton.addEventListener(
            "click",
            () =>
            {
                if(
                    heatmapMode ===
                    "gdp"
                )
                {
                    heatmapMode =
                        "none";

                    resetCountryColors();
                }
                else
                {
                    heatmapMode =
                        "gdp";

                    applyGDPHeatmap();
                }
            }
        );
    }

    if(densityButton)
    {
        densityButton.addEventListener(
            "click",
            () =>
            {
                if(
                    heatmapMode ===
                    "density"
                )
                {
                    heatmapMode =
                        "none";

                    resetCountryColors();
                }
                else
                {
                    heatmapMode =
                        "density";

                    applyPopulationDensityHeatmap();
                }
            }
        );
    }
}


// const heatmapButton =
//     document.getElementById(
//         "toggleHeatmap"
//     );

// if(heatmapButton)
// {
//     heatmapButton.addEventListener(
//         "click",
//         () =>
//         {
//             heatmapEnabled =
//                 !heatmapEnabled;

//             if(
//                 heatmapEnabled
//             )
//             {
//                 applyGDPHeatmap();
//             }
//             else
//             {
//                 resetCountryColors();
//             }
//         }
//     );
// }

// document
// .getElementById(
//     "toggleHeatmap"
// )
// .addEventListener(
//     "click",
//     () =>
//     {
//         if(
//             heatmapMode ===
//             "gdp"
//         )
//         {
//             heatmapMode =
//                 "none";

//             resetCountryColors();

//             return;
//         }

//         heatmapMode =
//             "gdp";

//         applyGDPHeatmap();
//     }
// );