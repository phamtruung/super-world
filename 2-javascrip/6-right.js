// #region DivRight
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

        // Title
        this.elGeneral.appendChild(UI.Paragraph.Divide("Tổng Quan"))
        // Capital
        this.elCapital = new ContentLine(this.elGeneral, "Thủ Đô", "", null);
        // Region
        this.elRegion = new ContentLine(this.elGeneral, "Châu Lục", "", null);
        // SubRegion
        this.elSubRegion = new ContentLine(this.elGeneral, "Khu Vực", "", null);
        // Area
        this.elArea = new ContentLine(this.elGeneral, "Diện Tích", "", "km2");
    }

    // #region createElPolitical
    createElPolitical() {
        // Political
        this.elPolitical = UI.Div.Column(UI.ClassName.ForApp.Political);
        this.elContent.appendChild(this.elPolitical);

        // Title
        this.elPolitical.appendChild(UI.Paragraph.Divide("Chính Trị"))
        // Goverment
        this.elGoverment = new ContentLine(this.elPolitical, "Thể Chế", "", null);
        // Population
        this.elPopulation = new ContentLine(this.elPolitical, "Dân Số", "", "người");
        // Population Per Km2
        this.elPopulationDensity = new ContentLine(this.elPolitical, "Mật Độ", "", "người/km2");
    }

    // #region createElEconomic
    createElEconomic() {
        // Economic
        this.elEconomic = UI.Div.Column(UI.ClassName.ForApp.Economic);
        this.elContent.appendChild(this.elEconomic);

        // Title
        this.elEconomic.appendChild(UI.Paragraph.Divide("Kinh Tế"))

        // Currency
        this.elCurrency = new ContentLine(this.elEconomic, "Tiền Tệ", "", null);
        // GDP
        this.elGDP = new ContentLine(this.elEconomic, "GDP", "", "triệu USD");
        // GDPPerPerson
        this.elGDPPerson = new ContentLine(this.elEconomic, "GDP Người", "", "USD/người/năm");
        // Oil
        this.elOil = new ContentLine(this.elEconomic, "Dầu Mỏ", "", "TWh");
        // Gold
        this.elGoldGeological = new ContentLine(this.elEconomic, "Vàng Tài Nguyên", "", "Tấn");
        this.elGoldBank = new ContentLine(this.elEconomic, "Vàng Dự Trữ", "", "Tấn");
        this.elGoldTotal = new ContentLine(this.elEconomic, "Vàng Tổng", "", "Tấn");
    }

    // #region showCountry
    showCountry(iso3) {
        this.elFlag.src = ``;
        this.elName.innerHTML = `${iso3} <br> (chưa được công nhận)`;
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
        this.elCapital.changeValue(superCountry.capital);
        this.elRegion.changeValue(superCountry.chau_luc);
        this.elSubRegion.changeValue(superCountry.khu_vuc);
        this.elArea.changeValue(Helper.Number.formatNumber(superCountry.area));
    }

    showPolitical(superCountry) {
        this.elGoverment.changeValue(superCountry.the_che);
        this.elPopulation.changeValue(Helper.Number.formatNumber(superCountry.population));
        this.elPopulationDensity.changeValue(Helper.Number.formatNumber(superCountry.populationDensity));
    }

    showEconomic(superCountry) {
        this.elCurrency.changeValue(superCountry.currency);
        this.elGDP.changeValue(Helper.Number.formatNumber(superCountry.gdpMilion));
        this.elGDPPerson.changeValue(Helper.Number.formatNumber(superCountry.gdpPerson));
        this.elOil.changeValue(Helper.Number.formatNumber(superCountry.oil));
        this.elGoldGeological.changeValue(Helper.Number.formatNumber(superCountry.gold_geological));
        this.elGoldBank.changeValue(Helper.Number.formatNumber(superCountry.gold_bank));
        this.elGoldTotal.changeValue(Helper.Number.formatNumber(superCountry.goldTotal));
    }
}
