{{- define "app_env" }}
{{- range $key, $value := .Values.environment }}
{{- $item := get $.Values.environment $key }}
{{- if or (kindIs "string" $item) (kindIs "int64" $item) (kindIs "bool" $item)}}
- name: {{ $key }}
  value: {{ $value | quote }}
{{- else }}
- name: {{ $key }}
  value: {{ pluck $.Values.global.env $item | first | default $item._default | quote }}
{{- end }}
{{- end }}
{{- end }}

{{- define "node_env" }}
{{- range $key, $value := .Values.node_environment }}
{{- $item := get $.Values.node_environment $key }}
{{- if or (kindIs "string" $item) (kindIs "int64" $item) (kindIs "bool" $item)}}
- name: {{ $key }}
  value: {{ $value | quote }}
{{- else }}
- name: {{ $key }}
  value: {{ pluck $.Values.global.env $item | first | default $item._default | quote }}
{{- end }}
{{- end }}
{{- end }}
