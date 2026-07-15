import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Client, Project, Retainer, DocumentAndNote, WebhookAlert, AppState } from './types';

// localStorage fallback keys
const STORAGE_KEYS = {
  CLIENTS: 'conextsol_clients',
  PROJECTS: 'conextsol_projects',
  RETAINERS: 'conextsol_retainers',
  DOCUMENTS: 'conextsol_documents',
  ALERTS: 'conextsol_alerts_log'
};

// Local storage helpers
const getLocal = <T>(key: string, defaultValue: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing local storage key', key, e);
    return defaultValue;
  }
};

const saveLocal = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const supabaseService = {
  // CLIENTS CRUD
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('company_name', { ascending: true });
      if (error) {
        console.error('Error fetching clients from Supabase, falling back:', error);
        return getLocal<Client>(STORAGE_KEYS.CLIENTS, []);
      }
      return data || [];
    }
    return getLocal<Client>(STORAGE_KEYS.CLIENTS, []);
  },

  async saveClient(client: Client): Promise<void> {
    if (isSupabaseConfigured && supabase) {
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
      if (error) console.error('Error saving client to Supabase:', error);
    }
    
    // Always sync local storage
    const local = getLocal<Client>(STORAGE_KEYS.CLIENTS, []);
    const index = local.findIndex(c => c.id === client.id);
    if (index >= 0) {
      local[index] = { ...client, updated_at: new Date().toISOString() };
    } else {
      local.push(client);
    }
    saveLocal(STORAGE_KEYS.CLIENTS, local);
  },

  async deleteClient(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting client from Supabase:', error);
    }
    const local = getLocal<Client>(STORAGE_KEYS.CLIENTS, []);
    saveLocal(STORAGE_KEYS.CLIENTS, local.filter(c => c.id !== id));
  },

  // PROJECTS CRUD
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('project_name', { ascending: true });
      if (error) {
        console.error('Error fetching projects from Supabase, falling back:', error);
        return getLocal<Project>(STORAGE_KEYS.PROJECTS, []);
      }
      
      // Parse JSONB types safely
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
    }
    return getLocal<Project>(STORAGE_KEYS.PROJECTS, []);
  },

  async saveProject(project: Project): Promise<void> {
    if (isSupabaseConfigured && supabase) {
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
      if (error) console.error('Error saving project to Supabase:', error);
    }

    const local = getLocal<Project>(STORAGE_KEYS.PROJECTS, []);
    const index = local.findIndex(p => p.id === project.id);
    if (index >= 0) {
      local[index] = { ...project, updated_at: new Date().toISOString() };
    } else {
      local.push(project);
    }
    saveLocal(STORAGE_KEYS.PROJECTS, local);
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting project from Supabase:', error);
    }
    const local = getLocal<Project>(STORAGE_KEYS.PROJECTS, []);
    saveLocal(STORAGE_KEYS.PROJECTS, local.filter(p => p.id !== id));
  },

  // RETAINERS CRUD
  async getRetainers(): Promise<Retainer[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('retainers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching retainers from Supabase, falling back:', error);
        return getLocal<Retainer>(STORAGE_KEYS.RETAINERS, []);
      }
      return data || [];
    }
    return getLocal<Retainer>(STORAGE_KEYS.RETAINERS, []);
  },

  async saveRetainer(retainer: Retainer): Promise<void> {
    if (isSupabaseConfigured && supabase) {
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
      if (error) console.error('Error saving retainer to Supabase:', error);
    }

    const local = getLocal<Retainer>(STORAGE_KEYS.RETAINERS, []);
    const index = local.findIndex(r => r.id === retainer.id);
    if (index >= 0) {
      local[index] = { ...retainer, updated_at: new Date().toISOString() };
    } else {
      local.push(retainer);
    }
    saveLocal(STORAGE_KEYS.RETAINERS, local);
  },

  async deleteRetainer(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('retainers')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting retainer from Supabase:', error);
    }
    const local = getLocal<Retainer>(STORAGE_KEYS.RETAINERS, []);
    saveLocal(STORAGE_KEYS.RETAINERS, local.filter(r => r.id !== id));
  },

  // DOCUMENTS CRUD
  async getDocuments(): Promise<DocumentAndNote[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('documents_and_notes')
        .select('*')
        .order('title', { ascending: true });
      if (error) {
        console.error('Error fetching documents from Supabase, falling back:', error);
        return getLocal<DocumentAndNote>(STORAGE_KEYS.DOCUMENTS, []);
      }
      return data || [];
    }
    return getLocal<DocumentAndNote>(STORAGE_KEYS.DOCUMENTS, []);
  },

  async saveDocument(doc: DocumentAndNote): Promise<void> {
    if (isSupabaseConfigured && supabase) {
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
      if (error) console.error('Error saving document to Supabase:', error);
    }

    const local = getLocal<DocumentAndNote>(STORAGE_KEYS.DOCUMENTS, []);
    const index = local.findIndex(d => d.id === doc.id);
    if (index >= 0) {
      local[index] = { ...doc, updated_at: new Date().toISOString() };
    } else {
      local.push(doc);
    }
    saveLocal(STORAGE_KEYS.DOCUMENTS, local);
  },

  async deleteDocument(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('documents_and_notes')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting document from Supabase:', error);
    }
    const local = getLocal<DocumentAndNote>(STORAGE_KEYS.DOCUMENTS, []);
    saveLocal(STORAGE_KEYS.DOCUMENTS, local.filter(d => d.id !== id));
  },

  // ALERTS LOG
  async getAlertsLog(): Promise<WebhookAlert[]> {
    // Alerts are typically ephemeral/simulated triggers, so we manage them primarily in localStorage
    return getLocal<WebhookAlert>(STORAGE_KEYS.ALERTS, []);
  },

  async saveAlert(alert: WebhookAlert): Promise<void> {
    const local = getLocal<WebhookAlert>(STORAGE_KEYS.ALERTS, []);
    local.unshift(alert); // Keep latest at top
    saveLocal(STORAGE_KEYS.ALERTS, local.slice(0, 100)); // cap at 100 entries
  },

  async clearAlertsLog(): Promise<void> {
    saveLocal(STORAGE_KEYS.ALERTS, []);
  },

  // Seed / Demo backup mechanism
  seedDemoData(demoClients: Client[], demoProjects: Project[], demoRetainers: Retainer[], demoDocs: DocumentAndNote[], demoAlerts: WebhookAlert[]) {
    saveLocal(STORAGE_KEYS.CLIENTS, demoClients);
    saveLocal(STORAGE_KEYS.PROJECTS, demoProjects);
    saveLocal(STORAGE_KEYS.RETAINERS, demoRetainers);
    saveLocal(STORAGE_KEYS.DOCUMENTS, demoDocs);
    saveLocal(STORAGE_KEYS.ALERTS, demoAlerts);
  },

  clearAllLocalData() {
    saveLocal(STORAGE_KEYS.CLIENTS, []);
    saveLocal(STORAGE_KEYS.PROJECTS, []);
    saveLocal(STORAGE_KEYS.RETAINERS, []);
    saveLocal(STORAGE_KEYS.DOCUMENTS, []);
    saveLocal(STORAGE_KEYS.ALERTS, []);
  }
};
