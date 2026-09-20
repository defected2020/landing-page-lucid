// framer-motion feature bundle, loaded on demand by the LazyMotion provider in
// pages/_app.js so it stays out of the first-load JavaScript. domMax (rather
// than domAnimation) because the mobile navigation uses layout animations.
import { domMax } from 'framer-motion';

export default domMax;
