module.exports.details = {
    name: "gestionannonces",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
local sauvegardes = {"Sauvegarde 1","Sauvegarde 2","Sauvegarde 3"}
local t = emodules.new()

t.name = "Gestion annonces"
t.desc = "Permet d'automatiser l'envoi d'annonces"

function t:onStop()
    for k, v in pairs(sauvegardes) do 
        if timer.Exists("annonce_"..v) then 
            timer.Remove("annonce_"..v)
        end
    end
end

t:addConfig("open",{
    name = "Ouvrir le menu",
    desc = "Ouvrir le menu de gestion d'annonces",
    vgui = "DButton",
    text = "Ouvrir",
    callback = function()
        if not emodules:getmactive("Gestion annonces") then return end

        window:Remove()

        if not file.Exists("sauvconf.json","DATA") then 
            local tabtosend = {}
            for k ,v in pairs(sauvegardes) do 
                tabtosend[v] = {
                    name = "",
                    duration = 0 ,
                    interval = 0
                }
            end
            file.Write("sauvconf.json",util.TableToJSON(tabtosend))
        end
            
        local conf =  util.JSONToTable(file.Read("sauvconf.json","DATA"))
        local window = SimpleRP.createWindow()
        window:SetSize(800, 700)
        window:Center()
        window:addBottomButton("FERMER", function()
            window:Remove()
        end)

        function window:Paint(w,h) 
            draw.RoundedBox(10, 0, 0, w, h, Color(28, 31, 36, 240))
            draw.SimpleText("Menu de gestion des annonces","Sansation45",w/2,h/9,Color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
        end

        local save = vgui.Create( "DHorizontalScroller", window )
        save:Dock(TOP )
        save:SetSize(0,40)
        save:DockMargin(180,115,50,0)

        local open = false 
        local text 
        local duration 
        local intervale
        local buttonselect 
        for k , v in pairs(sauvegardes) do 
            local button = save:Add("DButton")

            function button:Paint(w,h)
                draw.RoundedBox(10, 0, 0, w, h, Color(101,111,213,255))
                if buttonselect == self then 
                    draw.SimpleText(v,"Sansation20",w/2,h/2,Color(97,95,95),TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
                else
                    draw.SimpleText(v,"Sansation20",w/2,h/2,Color(255,255,255),TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
                end
            end
            button:SetSize(125,25)
            button:Dock(LEFT)
            button:SetText("")
            button:DockMargin(10,0,0,0)

            function button:DoClick()
                local Menu = DermaMenu()

                if timer.Exists("annonce_"..v) then 
                    Menu:AddOption( "Stopper",function()
                        if timer.Exists("annonce_"..v) then 
                            timer.Remove("annonce_"..v)
                        end
                    end):SetIcon("icon16/cross.png")
                else
                    Menu:AddOption( "Publier",function()
                        if conf[v].name == "" then return end
                        if conf[v].interval == "0" then return end
                        RunConsoleCommand("say","/annonce "..conf[v].name)
                        timer.Create("annonce_"..v,conf[v].interval*60,conf[v].duration,function ()
                            RunConsoleCommand("say","/annonce "..conf[v].name)
                        end)
                    end):SetIcon("icon16/resultset_next.png")
                end
                if buttonselect == button then 
                    Menu:AddOption( "Réinitialiser",function()
                        conf[v] = { name = "",duration = 0 ,interval = 0}
            
                        text:SetValue(conf[v].name)
                        duration:SetValue(conf[v].duration)
                        intervale:SetValue(conf[v].interval)
                    
                        file.Write("sauvconf.json",util.TableToJSON(conf))
                    end):SetIcon("icon16/delete.png")
                    Menu:AddOption( "Sauvegarder",function()
                        conf[v].name = text:GetValue()
                        conf[v].duration = duration:GetValue()
                        conf[v].interval= intervale:GetValue()
                        file.Write("sauvconf.json",util.TableToJSON(conf))
                    end):SetIcon("icon16/folder_add.png")
                end
                Menu:AddOption( "Editer",function()
                    buttonselect = button
                    
                    if open then 
                        text:SetValue(conf[v].name)
                        duration:SetValue(conf[v].duration)
                        intervale:SetValue(conf[v].interval)
                    else
                        open = true
            
                        local an = vgui.Create("DLabel", window)
                        an:Dock(TOP)
                        an:DockMargin(70, 90, 70, 0)
                        an:SetFont("Sansation20")
                        an:SetText("Annonce   (Ne pas ecrire /annonce)")
                        an:SizeToContents()
                    
                        text = vgui.Create( "DTextEntry", window)
                        text:Dock( TOP )
                        text:SetSize(400,50)
                        text:DockMargin( 70, 20, 70, 0 )
                        text:SetPlaceholderText( "Votre annonce" )
                    
                        function text:AllowInput(stringValue )
                            if #text:GetValue() >= 114 then
                                return true
                            else
                                return false	
                            end
                        end
                    
                        local dur = vgui.Create("DLabel", window)
                        dur:Dock(TOP)
                        dur:DockMargin(70, 20, 70, 0)
                        dur:SetFont("Sansation20")
                        dur:SetText("Nombre de répétition(s)")
                        dur:SizeToContents()
                
                        local rep = vgui.Create( "DLabel", window)
                        rep:Dock(TOP)
                        rep:DockMargin(515, -20, 70, 0)
                        rep:SetFont("Sansation20")
                        rep:SetText("Intervale (en minutes)")
                        rep:SizeToContents()
            
                        duration = vgui.Create( "DTextEntry", window)
                        duration:DockMargin(70,10,0,210)
                        duration:Dock( LEFT )
                        duration:SetSize(215,40)
                        duration:SetPlaceholderText( "Nombre de fois que l'annonce sera répétée" )
                        duration:SetNumeric(true)
                        function  duration:AllowInput(stringValue )
                            if stringValue == "-" or stringValue == "."  or stringValue == "+" or stringValue == "*" or stringValue == "/" then 
                                return true 
                            end
                        end
            
                        intervale = vgui.Create( "DTextEntry", window)
                        intervale:Dock( RIGHT  )
                        intervale:DockMargin( 0, 10, 70, 210 )
                        intervale:SetSize(215,40)
                        intervale:SetPlaceholderText( "Intervale en minute entre chaque annonce(s)" )
                        intervale:SetNumeric(true)
                        function intervale:AllowInput(stringValue )
                            if stringValue == "-" or stringValue == "."  or stringValue == "+" or stringValue == "*" or stringValue == "/" then 
                                return true 
                            end
                        end
            
                        text:SetValue(conf[v].name)
                        duration:SetValue(conf[v].duration)
                        intervale:SetValue(conf[v].interval)
                    end

                end):SetIcon("icon16/book_edit.png")

                Menu:Open()
            end
        end
    end
})

t:End()

`