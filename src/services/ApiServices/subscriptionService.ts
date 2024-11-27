import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllSubscriptions() {

    const response = await axios.get(
        `${BASE_URL}/api/subscriptions`,
        ngrokSkipWarning
    );
    return response.data;
}

export async function getSubscriptionById(id: Number) {
    const response = await axios.get(
        `${BASE_URL}/api/subscriptions/${id}`,
        ngrokSkipWarning
    );
    return response.data;
}

export async function addSubscription(subscriptionData: any) {

    const response = await axios.post(
        `${BASE_URL}/api/subscriptions`,
        subscriptionData,
        ngrokSkipWarning
    );
    return response.data;
}

export async function updateSubscription(id: Number, subscriptionData: any) {

    const response = await axios.put(
        `${BASE_URL}/api/subscriptions/${id}`,
        subscriptionData,
        ngrokSkipWarning
    );
    return response.data;
}

export async function getSubscriptionByProviderId(providerId: number) {
    const response = await axios.get(
        `${BASE_URL}/api/subscriptions/by-provider/${providerId}`,
        ngrokSkipWarning
    );
    return response.data;
}
