// Compliance Packages API

import { apiClient } from './client';
import type {
  CompliancePackage,
  ListCompliancePackagesResponse,
  PackagesPaginationParams,
} from './types';

export const packagesApi = {
  /**
   * List all compliance packages with optional pagination
   */
  async listPackages(
    params?: PackagesPaginationParams
  ): Promise<ListCompliancePackagesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.last_uploaded_at) {
      searchParams.append('last_uploaded_at', params.last_uploaded_at);
    }
    if (params?.last_id) {
      searchParams.append('last_id', params.last_id);
    }

    const queryString = searchParams.toString();
    const path = queryString ? `/packages?${queryString}` : '/packages';
    
    return apiClient.get<ListCompliancePackagesResponse>(path);
  },

  /**
   * Get specific package by ID
   */
  async getPackage(packageId: string): Promise<CompliancePackage> {
    return apiClient.get<CompliancePackage>(`/packages/${packageId}`);
  },

  /**
   * Get all packages from a conversation session
   */
  async getConversationPackages(
    sessionId: string
  ): Promise<ListCompliancePackagesResponse> {
    return apiClient.get<ListCompliancePackagesResponse>(
      `/conversations/${sessionId}/packages`
    );
  },
};
