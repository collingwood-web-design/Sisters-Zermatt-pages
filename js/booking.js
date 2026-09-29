(function () {
  var styles = {
    CustomAccentColor: "#333333",
    CustomAccentColorHover: "#B49578",
    CustomBGColor: "#F4E9DC",
    CustomButtonBGColor: "#C3A88A",
    CustomButtonColor: "#111111",
    CustomButtonHoverBGColor: "#B49578",
    CustomCalendarBackgroundColor: "#E3D0BC",
    CustomColor: "#333333",
    CustomFieldBackgroundColor: "#E3D0BC",
    CustomIconColor: "#333333",
    CustomLabelColor: "#333333",
    CustomPromoIconColor: "#333333",
    CustomPromoTextColor: "#333333",
    CustomWidgetBGColor: "#E3D0BC",
    CustomWidgetColor: "#333333"
  };

  window.SBSyncroBox = window.SBSyncroBox || function () {
    (window.SBSyncroBox.q = window.SBSyncroBox.q || []).push(arguments);
  };
  window.SBSyncroBox.l = Date.now();

  var boxes = [
    { container: "sb-chesa", id: 10166, name: "HOTEL CHESA VALESE" },
    { container: "sb-chesa-2", id: 10166, name: "HOTEL CHESA VALESE" },
    { container: "sb-daniela", id: 4631, name: "Hotel Daniela" },
    { container: "sb-daniela-2", id: 4631, name: "Hotel Daniela" }
  ];

  var found = boxes.filter(function (box) {
    return document.getElementById(box.container);
  });
  if (!found.length) return;

  var lang = (document.documentElement.lang || "en").slice(0, 2).toUpperCase();

  found.forEach(function (box) {
    window.SBSyncroBox({
      CodLang: lang,
      MainContainerId: box.container,
      Styles: styles,
      Properties: [{ id: box.id, name: box.name }]
    });
  });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://cdn.simplebooking.it/search-box-script.axd?IDA=10166";
  document.head.appendChild(script);
})();
