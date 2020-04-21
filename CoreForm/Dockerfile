#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV DATA_LOCATION /usr/share/coreform
VOLUME /usr/share/coreform 

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["CoreForm/CoreForm.csproj", "CoreForm/"]
RUN dotnet restore "CoreForm/CoreForm.csproj"
COPY . .
WORKDIR "/src/CoreForm"
RUN dotnet build "CoreForm.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CoreForm.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreForm.dll"]