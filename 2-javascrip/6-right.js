class DivRight {
    constructor(elFather, folderFlag) {
        
        // FolderFlag
        this.folderFlag = folderFlag;

        // Main
        this.elMain = UI.Div.Column(UI.ClassName.FixPanel, false);
        this.elMain.classList.add(UI.ClassName.Scroll);
        this.elMain.classList.add(UI.ClassName.Hidden);
        elFather.appendChild(this.elMain);

        // Flag
        this.elFlag = UI.Draw.Image(null, UI.ClassName.ForApp.Flag);
        this.elMain.appendChild(this.elFlag);

        // Name
        this.elName = UI.Paragraph.Title('');
        this.elMain.appendChild(this.elName);

        // Content
        this.elContent = UI.Div.Column();
        this.elMain.appendChild(this.elContent);

        // Content Element
        this.createElGeneral();
        this.createElPolitical();
        this.createElEconomic();
    }

    // #region createElGeneral
    createElGeneral() {
        // General
        this.elGeneral = UI.Div.Column(UI.ClassName.ForApp.General);
        this.elContent.appendChild(this.elGeneral);
        this.elGeneral.appendChild(UI.Paragraph.Divide("Tổng Quan"))

        // Capital
        this.elRowCapital = UI.Div.Row(UI.ClassName.Wrap);
        this.elGeneral.appendChild(this.elRowCapital);
        this.elRowCapital.appendChild(UI.Paragraph.Label("Thủ Đô: "))
        this.elCapital = UI.Paragraph.Text();
        this.elRowCapital.appendChild(this.elCapital);

        // Region
        this.elRowRegion = UI.Div.Row(UI.ClassName.Wrap);
        this.elGeneral.appendChild(this.elRowRegion);
        this.elRowRegion.appendChild(UI.Paragraph.Label("Châu Lục: "))
        this.elRegion = UI.Paragraph.Text();
        this.elRowRegion.appendChild(this.elRegion)

        // Area
        this.elRowArea = UI.Div.Row(UI.ClassName.Wrap);
        this.elGeneral.appendChild(this.elRowArea);
        this.elRowArea.appendChild(UI.Paragraph.Label("Diện Tích: "))
        this.elArea = UI.Paragraph.Text();
        this.elRowArea.appendChild(this.elArea)

        // Unit
        this.elRowArea.appendChild(UI.Paragraph.Text("km2"));    
    }

    // #region createElPolitical
    createElPolitical() {
        // Political
        this.elPolitical = UI.Div.Column(UI.ClassName.ForApp.Political);
        this.elContent.appendChild(this.elPolitical);
        this.elPolitical.appendChild(UI.Paragraph.Divide("Chính Trị"))

        // Goverment
        this.elRowGovement = UI.Div.Row(UI.ClassName.Wrap);
        this.elPolitical.appendChild(this.elRowGovement);
        this.elGoverment = UI.Paragraph.Text();
        this.elRowGovement.appendChild(this.elGoverment);

        // Population
        this.elRowPopulation = UI.Div.Row(UI.ClassName.Wrap);
        this.elPolitical.appendChild(this.elRowPopulation);
        this.elRowPopulation.appendChild(UI.Paragraph.Label("Dân Số: "))
        this.elPopulation = UI.Paragraph.Text();
        this.elRowPopulation.appendChild(this.elPopulation);

        // Unit Population
        this.elRowPopulation.appendChild(UI.Paragraph.Text("người"));

        // Population Per Km2
        this.elRowPopulationPerPerson = UI.Div.Row(UI.ClassName.Wrap);
        this.elPolitical.appendChild(this.elRowPopulationPerPerson);
        this.elRowPopulationPerPerson.appendChild(UI.Paragraph.Label("Mật Độ: "))
        this.elPopulationPerKm2 = UI.Paragraph.Text();
        this.elRowPopulationPerPerson.appendChild(this.elPopulationPerKm2);

        // Unit Population Per Km2
        this.elRowPopulationPerPerson.appendChild(UI.Paragraph.Text("người/km2"));
    }

    // #region createElEconomic
    createElEconomic() {
        // Economic
        this.elEconomic = UI.Div.Column(UI.ClassName.ForApp.Economic);
        this.elContent.appendChild(this.elEconomic);
        this.elEconomic.appendChild(UI.Paragraph.Divide("Kinh Tế"))

        // Currency
        this.elRowCurrency = UI.Div.Row(UI.ClassName.Wrap);
        this.elEconomic.appendChild(this.elRowCurrency);
        this.elRowCurrency.appendChild(UI.Paragraph.Label("Tiền Tệ: "))
        this.elCurrency = UI.Paragraph.Text();
        this.elRowCurrency.appendChild(this.elCurrency)

        // GDP
        this.elRowGDP = UI.Div.Row(UI.ClassName.Wrap);
        this.elEconomic.appendChild(this.elRowGDP);
        this.elRowGDP.appendChild(UI.Paragraph.Label("GDP: "))
        this.elGDP = UI.Paragraph.Text();
        this.elRowGDP.appendChild(this.elGDP);

        // Unit GDP
        this.elRowGDP.appendChild(UI.Paragraph.Text("tỉ USD"));

        // GDPPerPerson
        this.elRowGDPPerPerson = UI.Div.Row(UI.ClassName.Wrap);
        this.elEconomic.appendChild(this.elRowGDPPerPerson);
        this.elRowGDPPerPerson.appendChild(UI.Paragraph.Label("GDP Người: "))
        this.elGDPPerPerson = UI.Paragraph.Text();
        this.elRowGDPPerPerson.appendChild(this.elGDPPerPerson);

        // Unit GDP
        this.elRowGDPPerPerson.appendChild(UI.Paragraph.Text("USD/người"));
    }

    // #region showCountry
    showCountry(iso3) {
        this.elFlag.src = ``;
        this.elName.innerHTML = `${iso3}`;
        this.elMain.classList.remove(UI.ClassName.Hidden);
        this.elContent.classList.add(UI.ClassName.Hidden);
    }

    // #region showSuperCountry
    showSuperCountry(superCountry) {
        this.showName(superCountry);
        this.showGeneral(superCountry);
        this.showPolitical(superCountry);
        this.showEconomic(superCountry);
        this.elMain.classList.remove(UI.ClassName.Hidden);
        this.elContent.classList.remove(UI.ClassName.Hidden);
    }

    showName(superCountry) {
        this.elFlag.src = `${this.folderFlag}/${superCountry.iso2.toLowerCase()}.svg`;
        this.elName.innerHTML = superCountry.name;
    }

    showGeneral(superCountry) {
        this.elCapital.innerHTML = superCountry.capital;
        this.elRegion.innerHTML = superCountry.region;
        this.elArea.innerHTML = Helper.Number.formatNumber(superCountry.area);
    }

    showPolitical(superCountry) {
        this.elGoverment.innerHTML = superCountry.the_che;
        this.elPopulation.innerHTML = Helper.Number.formatNumber(superCountry.population);
        this.elPopulationPerKm2.innerHTML = Math.round(superCountry.populationPerKm2(),1);
    }

    showEconomic(superCountry) {
        this.elCurrency.innerHTML = superCountry.currency;
        this.elGDP.innerHTML = Helper.Number.formatNumber(Math.round(superCountry.gdp/1000_000_000));
        this.elGDPPerPerson.innerHTML = Helper.Number.formatNumber(superCountry.gdpPerPerson());
    }
}
