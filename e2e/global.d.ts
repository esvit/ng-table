

declare var capabilities: {
    browserName?: "chrome" | "firefox" | "internet explorer" | "safari";
    /**
     * Name of the capability
     */
    name?: string;
    /**
     * Name of the operating system running the process 
     */
    platform?: string;
    /**
     * Browser version
     */
    version?: number;
};