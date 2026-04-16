FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copia apenas o csproj primeiro
COPY *.csproj ./
RUN dotnet restore

# copia o resto do código
COPY . ./
RUN dotnet publish SistemaClinica.csproj -c Release -o /app/publish

# imagem final
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:$PORT

ENTRYPOINT ["dotnet", "SistemaClinica.dll"]