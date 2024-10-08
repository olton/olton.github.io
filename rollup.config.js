import nodeResolve from "@rollup/plugin-node-resolve"
import postcss from 'rollup-plugin-postcss'
import * as pkg from "./package.json" with { type: 'json' }

export default [
    {
        input: "./src/js/metroui.js",
        plugins: [
            nodeResolve(),
            postcss({
                extract: true,
                sourceMap: false,
                minimize: true,
                use: ["less"]
            })
        ],
        output: [
            {
                file: `./public/metroui/metro-${pkg.default.dependencies["@olton/metroui"].replace("^", "")}.js`,
            }
        ]
    }
]