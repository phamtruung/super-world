// UI = Using Javascript to create html element

const UI = {
    // #region IconText
    IconText: {
        Region: "Region",
        Population: "Population",
        GDP: "GDP"
    },

    // #region IconText
    _TextIcon: {
        Export: "y",
        Import: "x",
        Clear: "r",
        EditOpen: "H",
        EditClose: "\\",
        Show: "H",
        Hidden: "B",
        Add: "*",
        Delete: "t",
        Thing: "h",
        thingID: "h",
        things: "h",
        Population: "g",
        personID: "g",
        Tag: "T",
        tagID: "T",
        Location: "P",
        locationID: "P",
        Calendar: "Z",
        datetime: "Z",
        Note: "q",
        note: "q",
        Move: ">",
        phone: "J",
        Name: "Y",
        Region: "2",
        Content: "e",
        Map: "s",
        Back: "<",
        GDP: "c"
    },

    // #region ClassName
    ClassName: {
        // Paragraph
        AppName: "app-name",
        Header: "header",
        Title: "title",
        Divide: "divide",
        Label: "label",
        Text: "text",

        // Input
        Input: "input",
        SearchItem: "search-item",
        Option: "option",
        Selected: "selected",

        // Div
        FixPanel: "fix-panel",
        Main: "main",
        Scroll: "scroll",
        FlexCol: "flex-col",
        FlexRow: "flex-row",
        Wrap: "wrap",
        Hidden: "hidden",

        // Button
        NavigationButton: "navigation-button",
        ButtonIcon: "button-icon",
        Click: "click",

        // For App
        ForApp:{
            Map: "map",
            Country: "country",
            Flag: "flag",
            General: "general",
            Political: "political",
            Economic: "economic",
            NoForex: "-others",
        },
    },

    // #region IDName
    IDName: {
        SelectFilter: "select-filter",
        SearchInput: "search-input",
        SearchResult: "search-result",
    },

    //#region Icon
    Icon: {
        ByText(text) {
            const el = document.createElement('p');
            el.className = UI.ClassName.ButtonIcon;
            el.textContent = text;
            return el;
        },
    },

    //#region Button
    Button: {
        Text(text) {
            const el = document.createElement('button');
            el.textContent = text;
            return el;
        },
        Nav(text) {
            const el = document.createElement('button');
            el.className = UI.ClassName.NavigationButton;
            el.textContent = text;
            return el;
        },
        IconByText(textIcon) {
            const el = document.createElement('button');
            el.className = UI.ClassName.ButtonIcon;
            el.textContent = textIcon;
            return el;
        },
        IconByType(type) {
            const btn = this.IconByText(UI._TextIcon[type]);
            btn.title = type;
            return btn;
        },

    },
    //#region Input
    Input: {
        Number(value) {
            const el = document.createElement('input');
            el.type = 'number';
            el.value = value;
            return el;
        },
        Text() {
            const el = document.createElement('input');
            el.type = 'text';
            return el;
        },
        TextArea(text, rows=4) {
            const el = document.createElement('textarea');
            el.className = UI.ClassName.Input;
            el.rows = rows;
            el.value = text;
            return el;
        },
        Datetime(datetime, ) {
            const el = document.createElement('input');
            el.className = UI.ClassName.Input;
            el.type = 'datetime-local';
            if (datetime) {
                el.value = Helper.datetimeToString(datetime);
            } else {
                el.value = "";
            }
            return el;
        },
        Select(optionsDict) {
            const elSelect = document.createElement('select');
            elSelect.className = UI.ClassName.Option;

            Object.entries(optionsDict).forEach(([id, name]) => {
                const elOption = document.createElement('option');
                elOption.value = id;
                elOption.textContent = name;
                elSelect.appendChild(elOption);
            });

            return elSelect;
        },
        Color(value) {
            const el = document.createElement('input');
            el.type = 'color';
            el.value = value;
            return el;
        },
        File() {
            const el = document.createElement('input');
            el.type = 'file';
            el.accept = "application/json";
            el.style.display = "none";
            return el;
        }

    },

    //#region Paragraph
    Paragraph: {
        Text(text, className=null) {
            const el = document.createElement('p');
            el.className = UI.ClassName.Text;
            if (className) el.classList.add(className);
            el.textContent = text;
            return el;
        },
        Label(text) {
            const el = document.createElement('p');
            el.className = UI.ClassName.Label;
            el.textContent = text;
            return el;        
        },
        Divide(text) {
            const el = document.createElement('p');
            el.className = UI.ClassName.Divide;
            el.textContent = text;
            return el;        
        },
        Title(text) {
            const el = document.createElement('p');
            el.className = UI.ClassName.Title;
            el.textContent = text;
            return el;        
        },
        Header(text) {
            const el = document.createElement('p');
            el.className = UI.ClassName.Header;
            el.textContent = text;
            return el;        
        },
    },

    //#region Div
    Div:{
        Column(className=null, flex=true) {
            const el = document.createElement('div');
            if (flex) el.className = UI.ClassName.FlexCol;
            if (className) el.classList.add(className);
            return el;
        },
        Row(className=null, flex=true) {
            const el = document.createElement('div');
            if (flex) el.className = UI.ClassName.FlexRow;
            if (className) el.classList.add(className);
            return el;
        },
        Span() {
            return document.createElement('span');
        }
    },

    // #region Draw
    Draw:{
        Svg(className=null) {
            const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            if (className) el.classList.add(className);
            return el;
        },
        Polygon(points, className=null) {
            const el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            if (className) {
                el.classList.add(className);
            }
            el.setAttribute("points", points)      ;
            return el;
        },
        SVGGroup(className = null) {
            const el = document.createElementNS("http://www.w3.org/2000/svg", "g");
            if(className) el.classList.add(className);
            return el;
        },
        Image(source=null, className=null) {
            const el = document.createElement('img');
            if (source) el.src = source;
            if (className) el.classList.add(className);
            return el;
        }
    },

    // #region Color
    Color:{
        RandomHex() {
            const randomNum = Math.floor(Math.random() * 16777216);
            const hexColor = "#" + randomNum.toString(16).padStart(6, "0");
            return hexColor;
        },
        AddColor(polygons, nameClassColor) {
            if (nameClassColor) {
                polygons.forEach(polygon => {
                    polygon.classList.add(nameClassColor);
                });
            }

        },
        SetColorByClassName(polygons, className) {
            polygons.forEach(polygon => {
                polygon.setAttribute("class", className)
            });
        }
    }
}