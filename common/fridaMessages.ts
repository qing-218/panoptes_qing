export interface IWebViewTab {
    id: string;
    url: string;
    title: string;
}


type FridaPayload<Request, Response = null> = {
    requestType: Request,
    responseType: Response
}

export interface FridaRequests {
    GetTabs: FridaPayload<null, {
        tabs: IWebViewTab[];
    }>;

    Navigate: FridaPayload<{
        tabId: string;
        url: string;
    }>;

    Connect: FridaPayload<{
        tabId: string;
    }>;

    Disconnect: FridaPayload<{
        tabId: string;
    }>;

    AddScriptToEvaluateOnNewDocument: FridaPayload<{
        tabId: string;
        source: string;
    }, {
        identifier: string;
    }>;

    RemoveScriptToEvaluateOnNewDocument: FridaPayload<{
        tabId: string;
        identifier: string;
    }>;

    RegisterBinding: FridaPayload<{
        tabId: string;
        name: string;
    }>;

    Evaluate: FridaPayload<{
        tabId: string;
        expression: string;
    }>;
}

export interface FridaEvents {
    Navigated: {
        tabId: string;
        url: string;
    };

    LoadingFailed: {
        tabId: string;
        url: string;
        errorText: string;
    };

    BindingCalled: {
        tabId: string;
        name: string;
        payload: string;
    };
}

export interface FridaRequest {
    type: string,
    id: string,
    params: any
}

export interface FridaEvent {
    event: string,
    params: any
}

export interface FridaResponse {
    id: string,
    params: any
}
