import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Client, Project, Retainer, DocumentAndNote, WebhookAlert } from './types';

// For ephemeral Webhook Alerts history, keep it client-side / local storage based for history log
const ALERTS_STORAGE_KEY = 'conextsol_alerts_log';

export const supabaseService = {
  // CLIENTS CRUD
  async getClients(): Promise<Client[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured. Cannot fetch clients.');
      return [];
    }
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('company_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching clients from Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async saveClient(client: Client): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('clients')
      .upsert({
        id: client.id,
        company_name: client.company_name,
        primary_contact_name: client.primary_contact_name,
        email: client.email,
        phone: client.phone,
        status: client.status,
        created_at: client.created_at,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving client to Supabase:', error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting client from Supabase:', error);
      throw error;
    }
  },

  // PROJECTS CRUD
  async getProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured. Cannot fetch projects.');
      return [];
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('project_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      throw error;
    }

    return (data || []).map(p => ({
      ...p,
      services_listed: Array.isArray(p.services_listed) 
        ? p.services_listed 
        : typeof p.services_listed === 'string'
          ? JSON.parse(p.services_listed)
          : [],
      associated_emails: Array.isArray(p.associated_emails)
        ? p.associated_emails
        : typeof p.associated_emails === 'string'
          ? JSON.parse(p.associated_emails)
          : []
    }));
  },

  async saveProject(project: Project): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        client_id: project.client_id,
        project_name: project.project_name,
        start_date: project.start_date,
        end_date: project.end_date,
        invoiced_amount: project.invoiced_amount,
        short_note: project.short_note,
        staging_url: project.staging_url,
        production_url: project.production_url,
        github_url: project.github_url,
        services_listed: project.services_listed,
        associated_emails: project.associated_emails,
        created_at: project.created_at,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving project to Supabase:', error);
      throw error;
    }
  },

  async deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project from Supabase:', error);
      throw error;
    }
  },

  // RETAINERS CRUD
  async getRetainers(): Promise<Retainer[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured. Cannot fetch retainers.');
      return [];
    }
    const { data, error } = await supabase
      .from('retainers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching retainers from Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async saveRetainer(retainer: Retainer): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('retainers')
      .upsert({
        id: retainer.id,
        client_id: retainer.client_id,
        service_type: retainer.service_type,
        billing_amount: retainer.billing_amount,
        billing_cycle_day: retainer.billing_cycle_day,
        is_active: retainer.is_active,
        created_at: retainer.created_at,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving retainer to Supabase:', error);
      throw error;
    }
  },

  async deleteRetainer(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('retainers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting retainer from Supabase:', error);
      throw error;
    }
  },

  // DOCUMENTS CRUD
  async getDocuments(): Promise<DocumentAndNote[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured. Cannot fetch documents.');
      return [];
    }
    const { data, error } = await supabase
      .from('documents_and_notes')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) {
      console.error('Error fetching documents from Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async saveDocument(doc: DocumentAndNote): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('documents_and_notes')
      .upsert({
        id: doc.id,
        project_id: doc.project_id,
        title: doc.title,
        content: doc.content,
        file_references: doc.file_references,
        created_at: doc.created_at,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving document to Supabase:', error);
      throw error;
    }
  },

  async deleteDocument(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase
      .from('documents_and_notes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting document from Supabase:', error);
      throw error;
    }
  },

  // ALERTS LOG (ephemeral notifications history logs, stored in localStorage as browser logs feedback)
  async getAlertsLog(): Promise<WebhookAlert[]> {
    const data = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  async saveAlert(alert: WebhookAlert): Promise<void> {
    const data = localStorage.getItem(ALERTS_STORAGE_KEY);
    let list: WebhookAlert[] = [];
    if (data) {
      try {
        list = JSON.parse(data);
      } catch {}
    }
    list.unshift(alert);
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(list.slice(0, 100)));
  },

  async clearAlertsLog(): Promise<void> {
    localStorage.removeItem(ALERTS_STORAGE_KEY);
  }
};
