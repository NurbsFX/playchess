"use client"

import { motion } from "framer-motion"
import React from "react"

const LoadingDot = {
    display: "block",
    width: "0.75rem",
    height: "0.75rem",
    backgroundColor: "currentColor",
    borderRadius: "50%"
}

const LoadingContainer = {
    width: "4rem",
    height: "2rem",
    display: "flex",
    justifyContent: "space-around"
}

const ContainerVariants = {
    initial: {
        transition: { staggerChildren: 0.2 }
    },
    animate: {
        transition: { staggerChildren: 0.2 }
    }
}

const DotVariants = {
    initial: { y: "0%" },
    animate: { y: "100%" }
}

const DotTransition: import("framer-motion").Transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
}

export function LoadingDots() {
    return (
        <motion.div
            style={LoadingContainer}
            variants={ContainerVariants}
            initial="initial"
            animate="animate"
            aria-label="Chargement..."
        >
            <motion.span style={LoadingDot} variants={DotVariants} transition={DotTransition} />
            <motion.span style={LoadingDot} variants={DotVariants} transition={DotTransition} />
            <motion.span style={LoadingDot} variants={DotVariants} transition={DotTransition} />
        </motion.div>
    )
}