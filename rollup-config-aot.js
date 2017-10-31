import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
//import uglify      from 'rollup-plugin-uglify';

export default {
    output: {
        format: 'iife',
        file: 'dist/aot/build.js'
    },
    input: 'tmp/aot-js/src/main.js',
    sourcemap: true,
    onwarn: function (warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }

        // console.warn everything else
        console.warn(warning.message);
    },
    plugins: [
        nodeResolve({jsnext: true, module: true}),
        commonjs({
            include: [
                'node_modules/rxjs/**'
            ]
        })//,
        //uglify()
    ]
};
