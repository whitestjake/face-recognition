import React, { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


const ParticlesComponent = () => {
    const options = useMemo(() => {
        return {
            fullScreen: {
                enable: true,
                zIndex: -1
            },
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: 'push'
                    },
                    onHover: {
                        enable: true,
                        mode: 'repulse'
                }
                },
                modes: {
                    push: {
                        quantity: 5
                    },
                    repulse: {
                        distance: 100
                    }
                }
            },
            particles: {
                opacity: {
                    value: { min: 0.3, max: 3}
                },
                links: {
                    enable: true,
                    distance: 200
                },
                move: {
                    enable: true,
                    speed: { min: 1, max: 5 }
                },
                size: {
                    value: { min: 1, max: 3}
                }
            }
        };
    }, []);

    const particlesInit = useCallback((engine) => {
        loadFull(engine);

    }, []);

    return <Particles init={particlesInit} options={options} />
}

export default ParticlesComponent;