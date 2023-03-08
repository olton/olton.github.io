const age = $("#_age")
age.html(datetime("1972-12-21").distance(datetime(), "year"))

const copyYear = $("#_copy-year")
copyYear.html(`2019-${datetime().year()}`)