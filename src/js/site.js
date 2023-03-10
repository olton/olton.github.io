import {Metro5} from "@olton/metro5/src/core/metro"

globalThis.Metro5 = Metro5
globalThis.Metro = new Metro5({
    onInit: ()=>{

    }
})

import * as ResetCss from "@olton/metro5/src/common/reset"
import * as ColorCss from "@olton/metro5/src/common/colors"
import * as FontCss from "@olton/metro5/src/common/font"
import * as BorderCss from "@olton/metro5/src/common/border"
import * as AnimationCss from "@olton/metro5/src/common/animation"
import * as SpacingCss from "@olton/metro5/src/common/spacing"
import * as FlexCss from "@olton/metro5/src/common/flex"
import * as AlignCss from "@olton/metro5/src/common/align"
import * as DisplayCss from "@olton/metro5/src/common/display"
import {TypographyCss, TypographyExtCss} from "@olton/metro5/src/common/typography"
import * as ThemeCss from "@olton/metro5/src/common/theme"
import * as Grid from "@olton/metro5/src/components/grid"
import * as AppBar from "@olton/metro5/src/components/appbar"
import * as Container from "@olton/metro5/src/components/container"
import * as Hamburger from "@olton/metro5/src/components/hamburger"
import * as Button from "@olton/metro5/src/components/button"
import * as Progress from "@olton/metro5/src/components/progress"
import * as Cloak from "@olton/metro5/src/components/cloak"

const age = $("#_age")
age.html(datetime("1972-12-21").distance(datetime(), "year"))

const copyYear = $("#_copy-year")
copyYear.html(`2019-${datetime().year()}`)