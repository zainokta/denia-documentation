import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Explicit sidebar mirrors the documentation IA. Content lives under content/.
const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/requirements',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/first-service',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/overview',
        'concepts/projects-and-rbac',
        'concepts/services',
        'concepts/deployments',
        'concepts/replicas-and-autoscaling',
        'concepts/routes-and-domains',
        'concepts/jobs',
        'concepts/secrets',
        'concepts/registries',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/deploy-from-git',
        'guides/deploy-external-image',
        'guides/deploy-from-your-machine',
        'guides/custom-domains-tls',
        'guides/managing-secrets',
        'guides/scheduled-jobs',
        'guides/hosted-registry',
        'guides/service-console',
        'guides/observability',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/configuration',
        'reference/cli',
        'reference/api/authentication',
        'reference/api/v1',
        'reference/api/registry-v2',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/runtime-isolation',
        'architecture/ingress-and-tls',
        'architecture/design-decisions',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'operations/upgrading',
        'operations/backup-and-restore',
        'operations/uninstalling',
        'operations/security',
        'operations/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Project',
      items: ['project/roadmap', 'project/contributing'],
    },
  ],
};

export default sidebars;
